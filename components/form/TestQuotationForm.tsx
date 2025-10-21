import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import IntegratedQuotationForm from './IntegratedQuotationForm';

// Simple test component to verify the form works
const TestQuotationForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const testLeadData = {
    TripId: 'TEST-001',
    ClientLeadDetails: {
      FullName: 'Test Customer',
      Contact: '+91 9876543210',
      Email: 'test@example.com',
      TravelDate: '2024-12-15',
      Pax: '2',
      Child: '1',
      Infant: '0',
      Budget: '100000',
      DepartureCity: 'Delhi',
      DestinationName: 'Goa',
      Days: 4,
    },
    AssignDate: '2024-10-05',
  };

  const handleSubmit = (data: any) => {
    console.log('Test Form Submitted:', data);
    Alert.alert('Success', 'Test quotation created!');
    setShowForm(false);
  };

  if (showForm) {
    return (
      <IntegratedQuotationForm
        onSubmit={handleSubmit}
        lead={testLeadData}
      />
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-4">Test Quotation Form</Text>
      <TouchableOpacity
        onPress={() => setShowForm(true)}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-medium">Open Form</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestQuotationForm;
