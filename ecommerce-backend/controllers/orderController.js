const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.id} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image]
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString()
      }
    });
    
    // Update order with stripe session id
    order.stripeSessionId = session.id;
    await order.save();
    
    res.json({ sessionId: session.id, orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order with tracking
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Generate tracking timeline
    const trackingTimeline = generateTrackingTimeline(order);
    
    res.json({ order, trackingTimeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.orderStatus = status;
    
    // Update timestamps based on status
    if (status === 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'out_for_delivery') {
      order.outForDeliveryAt = new Date();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate tracking timeline
const generateTrackingTimeline = (order) => {
  const timeline = [];
  
  // Order placed
  timeline.push({
    status: 'Order Placed',
    description: 'Your order has been received',
    date: order.createdAt,
    completed: true
  });
  
  // Processing
  timeline.push({
    status: 'Processing',
    description: 'Your order is being processed',
    date: order.createdAt,
    completed: order.orderStatus !== 'processing'
  });
  
  // Shipped
  timeline.push({
    status: 'Shipped',
    description: 'Your order has been shipped',
    date: order.shippedAt || null,
    completed: ['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
  });
  
  // Out for delivery
  timeline.push({
    status: 'Out for Delivery',
    description: 'Your order is out for delivery',
    date: order.outForDeliveryAt || null,
    completed: ['out_for_delivery', 'delivered'].includes(order.orderStatus)
  });
  
  // Delivered
  timeline.push({
    status: 'Delivered',
    description: 'Your order has been delivered',
    date: order.deliveredAt || null,
    completed: order.orderStatus === 'delivered'
  });
  
  return timeline;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};