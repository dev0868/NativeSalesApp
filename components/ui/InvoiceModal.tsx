import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  customerName: string;
}

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, onClose }) => {
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2025-001',
      date: '2025-01-15',
      amount: 95000,
      status: 'paid',
      customerName: 'Amit Patel'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-002',
      date: '2025-01-18',
      amount: 25000,
      status: 'pending',
      customerName: 'Amit Patel'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-003',
      date: '2025-01-10',
      amount: 15000,
      status: 'overdue',
      customerName: 'Amit Patel'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2025-004',
      date: '2025-01-20',
      amount: 45000,
      status: 'paid',
      customerName: 'Amit Patel'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2025-005',
      date: '2025-01-22',
      amount: 35000,
      status: 'pending',
      customerName: 'Amit Patel'
    }
  ]);

  const handleCreateInvoice = () => {
    Alert.alert('Create Invoice', 'Create new invoice functionality would be implemented here', [
      { text: 'OK' }
    ]);
  };

  const handleInvoicePress = (invoice: Invoice) => {
    Alert.alert('Invoice Details', `Invoice: ${invoice.invoiceNumber}\nAmount: ₹${invoice.amount.toLocaleString()}\nStatus: ${invoice.status}`, [
      { text: 'OK' }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-green-100', text: 'text-green-800', color: '#10b981' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', color: '#f59e0b' };
      case 'overdue':
        return { bg: 'bg-red-100', text: 'text-red-800', color: '#dc2626' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', color: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-purple-600 p-4 pt-12 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-white/20 rounded-full p-2 mr-3">
                <Ionicons name="receipt" size={20} color="white" />
              </View>
              <Text className="text-white text-xl font-bold">Journey Routers</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/20 rounded-full p-2"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/80 text-sm">Invoice Management</Text>
        </View>

        {/* Content */}
        <View className="flex-1 p-4">
          {/* Invoice Header */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">Invoices</Text>
            <View className="flex-row items-center">
              <Ionicons name="person" size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Amit Patel</Text>
            </View>
          </View>

          {/* Create Invoice Button */}
          <TouchableOpacity
            onPress={handleCreateInvoice}
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Create Invoice</Text>
          </TouchableOpacity>

          {/* Invoices List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {invoices.map((invoice) => {
              const statusStyle = getStatusColor(invoice.status);
              return (
                <TouchableOpacity
                  key={invoice.id}
                  onPress={() => handleInvoicePress(invoice)}
                  className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-blue-600 font-semibold text-lg">
                      {invoice.invoiceNumber}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                      <Text className={`text-xs font-medium ${statusStyle.text}`}>
                        {getStatusText(invoice.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-500 text-sm mb-1">
                        Date: {invoice.date}
                      </Text>
                      <Text className="text-gray-900 font-bold text-lg">
                        ₹{invoice.amount.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center space-x-2">
                      <TouchableOpacity className="bg-blue-100 rounded-full p-2">
                        <Ionicons name="eye" size={16} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-green-100 rounded-full p-2">
                        <Ionicons name="download" size={16} color="#10b981" />
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-purple-100 rounded-full p-2">
                        <Ionicons name="share" size={16} color="#7c3aed" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Summary Card */}
          <View className="bg-white rounded-lg p-4 mt-4 shadow-sm">
            <Text className="text-gray-600 text-sm mb-2">Total Outstanding</Text>
            <Text className="text-purple-600 text-2xl font-bold">
              ₹{invoices
                .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
                .reduce((sum, inv) => sum + inv.amount, 0)
                .toLocaleString()}
            </Text>
            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="text-gray-500 text-xs">Paid</Text>
                <Text className="text-green-600 font-semibold">
                  ₹{invoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Pending</Text>
                <Text className="text-yellow-600 font-semibold">
                  ₹{invoices
                    .filter(inv => inv.status === 'pending')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Overdue</Text>
                <Text className="text-red-600 font-semibold">
                  ₹{invoices
                    .filter(inv => inv.status === 'overdue')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View className="bg-white border-t border-gray-200 p-4">
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity className="bg-gray-100 rounded-full p-3">
              <Ionicons name="grid" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-full p-3">
              <Ionicons name="flash" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-full p-3">
              <Ionicons name="create" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-purple-600 rounded-full p-3">
              <Ionicons name="person" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InvoiceModal;
