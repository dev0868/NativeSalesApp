import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import Navbar from "@/components/Navbar";
import FollowUpCards from "@/components/ui/cards/FollowUpCards";

export default function BookingsScreen() {
  // Sample data for follow-up cards
  const followUpData = [
    { id: '1', name: 'Vikash Singh' },
    { id: '2', name: 'Priya Sharma' },
    { id: '3', name: 'Amit Patel' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <Navbar 
        title="Follow Ups"
        subtitle="Manage your client follow-ups"
        showSearch={true}
        showNotifications={true}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      {/* Follow Up Cards */}
      <FlatList
        data={followUpData}
        keyExtractor={(item) => item.id}
        renderItem={() => <FollowUpCards />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Plus Button */}
     
    </View>
  );
}
