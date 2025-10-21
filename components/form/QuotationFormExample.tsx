import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import EnhancedQuotationForm from './EnhancedQuotationForm';

// Example usage component
const QuotationFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  // Example lead data (this would come from your actual lead data)
  const exampleLead = {
    TripId: 'TRP001',
    ClientLeadDetails: {
      FullName: 'John Doe',
      Contact: '+91 9876543210',
      Email: 'john.doe@example.com',
      TravelDate: '2024-12-15',
      Pax: '2',
      Child: '1',
      Infant: '0',
      Budget: '150000',
      DepartureCity: 'Delhi',
      DestinationName: 'Goa',
      Days: 5,
    },
    AssignDate: '2024-10-05',
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    // Here you would typically send the data to your API
    setShowForm(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Quotation Form Demo
      </Text>
      
      <TouchableOpacity
        onPress={() => setShowForm(true)}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-medium text-lg">
          Create New Quotation
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <EnhancedQuotationForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          lead={exampleLead}
        />
      </Modal>
    </View>
  );
};

export default QuotationFormExample;
