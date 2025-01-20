'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, PlusCircle, MinusCircle, Package, CreditCard, Banknote } from 'lucide-react';

const ShoppingApp = () => {
  // State Management
  const [inventory, setInventory] = useState({
    item1: { name: "Item 1", price: 20, stock: 1000 },
    item2: { name: "Item 2", price: 30, stock: 2000 },
    item3: { name: "Item 3", price: 40, stock: 1000 }
  });
  
  const [cart, setCart] = useState({
    item1: { name: "Item 1", price: 20, quantity: 0, bonus: 0 },
    item2: { name: "Item 2", price: 30, quantity: 0, bonus: 0 },
    item3: { name: "Item 3", price: 40, quantity: 0, bonus: 0 }
  });
  
  const [transactions, setTransactions] = useState([]);
  const [totalCashSales, setTotalCashSales] = useState(0);
  const [totalOnlineSales, setTotalOnlineSales] = useState(0);
  const [selectedPaymentType, setSelectedPaymentType] = useState('cash');

  // Helper Functions
  const calculateBonus = (quantity) => {
    if (quantity >= 10) return 4;
    if (quantity >= 5) return 1;
    return 0;
  };

  const updateQuantity = (itemKey, delta) => {
    const newQuantity = Math.max(0, cart[itemKey].quantity + delta);
    
    if (delta > 0 && newQuantity > inventory[itemKey].stock) {
      return;
    }

    const bonus = calculateBonus(newQuantity);
    
    setCart(prev => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        quantity: newQuantity,
        bonus: bonus
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  };

  const checkout = () => {
    const total = calculateTotal();
    if (total > 0) {
      // Update inventory
      const newInventory = { ...inventory };
      Object.entries(cart).forEach(([key, item]) => {
        newInventory[key].stock -= (item.quantity + item.bonus);
      });
      setInventory(newInventory);

      // Update payment type totals
      if (selectedPaymentType === 'cash') {
        setTotalCashSales(prev => prev + total);
      } else {
        setTotalOnlineSales(prev => prev + total);
      }

      // Record transaction
      const transaction = {
        id: Date.now(),
        items: { ...cart },
        total,
        paymentType: selectedPaymentType,
        date: new Date().toLocaleString()
      };
      setTransactions(prev => [...prev, transaction]);
      
      // Reset cart
      setCart({
        item1: { name: "Item 1", price: 20, quantity: 0, bonus: 0 },
        item2: { name: "Item 2", price: 30, quantity: 0, bonus: 0 },
        item3: { name: "Item 3", price: 40, quantity: 0, bonus: 0 }
      });
    }
  };

  // UI Rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory Card */}
        <Card className="md:col-span-1 bg-white/70 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Package className="w-6 h-6" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(inventory).map(([key, item]) => (
                <div key={key} 
                     className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-102"
                     style={{
                       backgroundColor: key === 'item1' ? 'rgb(253, 242, 248)' :
                                      key === 'item2' ? 'rgb(239, 246, 255)' :
                                                      'rgb(250, 245, 255)'
                     }}>
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className={`font-medium px-3 py-1 rounded-full ${
                    item.stock < 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    Stock: {item.stock}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-purple-50">
              <h3 className="font-medium text-purple-700 mb-3">✨ Special Offers:</h3>
              <ul className="space-y-2 text-sm text-purple-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Buy 5 items: Get 1 Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Buy 10 items: Get 4 Free
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Shopping Cart */}
        <Card className="md:col-span-2 bg-white/70 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="bg-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <ShoppingCart className="w-6 h-6" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(cart).map(([key, item]) => (
                <div key={key} 
                     className="flex items-center justify-between p-4 rounded-lg transition-all"
                     style={{
                       backgroundColor: key === 'item1' ? 'rgb(253, 242, 248)' :
                                      key === 'item2' ? 'rgb(239, 246, 255)' :
                                                      'rgb(250, 245, 255)'
                     }}>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                    {item.bonus > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        + {item.bonus} free items! 🎁
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(key, -1)}
                      className="hover:bg-pink-50"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(key, 1)}
                      disabled={inventory[key].stock < (item.quantity + 1)}
                      className="hover:bg-pink-50"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3 justify-center">
                <Button 
                  variant={selectedPaymentType === 'cash' ? 'default' : 'outline'}
                  onClick={() => setSelectedPaymentType('cash')}
                  className={`flex items-center gap-2 px-6 py-4 transition-all ${
                    selectedPaymentType === 'cash' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'hover:bg-green-50'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  Cash
                </Button>
                <Button 
                  variant={selectedPaymentType === 'online' ? 'default' : 'outline'}
                  onClick={() => setSelectedPaymentType('online')}
                  className={`flex items-center gap-2 px-6 py-4 transition-all ${
                    selectedPaymentType === 'online' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'hover:bg-blue-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Online
                </Button>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">
                  Total: ₹{calculateTotal()}
                </div>
                <Button 
                  onClick={checkout}
                  disabled={calculateTotal() === 0}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Checkout with {selectedPaymentType === 'cash' ? 'Cash' : 'Online Payment'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Summary */}
        <Card className="md:col-span-3 bg-white/70 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="bg-purple-50 rounded-t-lg">
            <CardTitle className="text-purple-700">Sales Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-lg bg-green-50 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Banknote className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Cash Sales</span>
                </div>
                <div className="text-2xl font-bold text-green-800">₹{totalCashSales}</div>
              </div>
              <div className="p-6 rounded-lg bg-blue-50 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Online Sales</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">₹{totalOnlineSales}</div>
              </div>
              <div className="p-6 rounded-lg bg-purple-50 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Total Sales</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">₹{totalCashSales + totalOnlineSales}</div>
              </div>
            </div>

            <div className="space-y-4">
              {transactions.map(transaction => (
                <div key={transaction.id} className="border rounded-lg p-6 bg-white/50 hover:bg-white/80 transition-all">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-gray-700">Transaction #{transaction.id}</span>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        transaction.paymentType === 'cash' ? 
                          'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'
                      }`}>
                        {transaction.paymentType === 'cash' ? 
                          <Banknote className="w-4 h-4" /> : 
                          <CreditCard className="w-4 h-4" />
                        }
                        {transaction.paymentType === 'cash' ? 'Cash' : 'Online'}
                      </span>
                      <span className="text-sm text-gray-500">{transaction.date}</span>
                    </div>
                  </div>
                  {Object.values(transaction.items)
                    .filter(item => item.quantity > 0)
                    .map(item => (
                      <div key={item.name} className="flex justify-between text-sm text-gray-600 py-1">
                        <span>{item.name} x {item.quantity} {item.bonus > 0 && `(+${item.bonus} free)`}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  <div className="mt-3 pt-3 border-t flex justify-between font-medium text-gray-700">
                    <span>Total</span>
                    <span>₹{transaction.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingApp;