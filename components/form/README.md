# Enhanced Quotation Form Components

A comprehensive React Native quotation form system built with React Hook Form, featuring multiple sections and dynamic functionality.

## Components Overview

### Main Components

1. **IntegratedQuotationForm** - Main form component that integrates with your existing wrapper
2. **EnhancedQuotationForm** - Standalone form component with all sections
3. **QuoatationFormWrapper** - Your existing section-based navigation wrapper

### Child Components

1. **BasicDetails** - Customer and trip information
2. **CostCalculator** - Cost breakdown with auto-calculation
3. **HotelsSection** - Hotels with add/delete functionality
4. **InclusionsExclusions** - Package inclusions and exclusions
5. **FlightSection** - Flight information and documents
6. **ItinerarySection** - Day-wise itinerary builder

## Usage

### Basic Usage with Integrated Form

```tsx
import React from 'react';
import { IntegratedQuotationForm } from './components/form';

const MyComponent = () => {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
    // Send to API
  };

  const leadData = {
    TripId: 'TRP001',
    ClientLeadDetails: {
      FullName: 'John Doe',
      Contact: '+91 9876543210',
      Email: 'john@example.com',
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

  return (
    <IntegratedQuotationForm
      onSubmit={handleSubmit}
      lead={leadData}
    />
  );
};
```

### Using Individual Components

```tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { BasicDetails, CostCalculator, HotelsSection } from './components/form';

const CustomForm = () => {
  const methods = useForm({
    defaultValues: {
      FullName: '',
      Contact: '',
      // ... other fields
    }
  });

  return (
    <FormProvider {...methods}>
      <BasicDetails />
      <CostCalculator />
      <HotelsSection />
    </FormProvider>
  );
};
```

## Form Data Structure

The form handles the following data structure:

```typescript
interface QuotationFormData {
  // Basic Details
  TripId: string;
  FullName: string;
  Contact: string;
  Email: string;
  TravelDate: string;
  AssignDate: string;
  NoOfPax: string;
  Child: string;
  Infant: string;
  Budget: string;
  Departure: string;
  DestinationName: string;
  Days: number;
  Nights: number;

  // Cost Calculator
  PriceType: string;
  CurrencyType: string;
  FlightCost: string;
  VisaCost: string;
  LandPackageCost: string;
  TotalTax: string;
  TotalCost: string;
  GST: string;
  TCS: string;
  GstWaivedOffAmt: string;
  TcsWaivedOffAmt: string;
  PackageWithGST: boolean;
  PackageWithTCS: boolean;

  // Hotels
  Hotels: HotelData[];

  // Inclusions & Exclusions
  Inclusions: string[];
  OtherInclusions: string;
  Exclusions: string[];
  OtherExclusions: string;

  // Flight & Itinerary
  flightsImagesLinks: string[];
  Itinearies: ItineraryData[];
  
  // Other
  travel_data: any;
  TravelEndDate: string;
}
```

## Features

### BasicDetails Component
- Customer information (name, contact, email)
- Trip details (destination, departure, dates)
- Passenger count (adults, children, infants)
- Budget input
- Form validation with required fields

### CostCalculator Component
- Flight, visa, and land package costs
- Tax configuration (GST/TCS)
- Auto-calculation of total cost
- Waived amount handling
- Real-time cost updates

### HotelsSection Component
- Add/delete hotel entries
- Hotel details (name, city, room type, category)
- Meal selection (multi-select)
- Check-in/check-out dates
- Comments for special requirements

### InclusionsExclusions Component
- Dynamic inclusion/exclusion lists
- Predefined quick-add options
- Custom text additions
- Visual categorization (green for inclusions, red for exclusions)

### FlightSection Component
- Outbound and return flight details
- Airline selection
- Flight times and dates
- Class selection
- Flight document links

### ItinerarySection Component
- Auto-generates days based on trip duration
- Day-wise activity management
- Meal planning per day
- Accommodation tracking
- Dynamic activity addition/removal

## Styling

The components use Tailwind CSS classes with NativeWind. Key styling features:

- Consistent color scheme (purple primary)
- Responsive design
- Card-based layouts
- Visual feedback for interactions
- Accessibility considerations

## Dependencies

- React Hook Form
- React Native
- Expo (Ionicons, LinearGradient)
- NativeWind (Tailwind CSS)

## Integration Notes

1. The `IntegratedQuotationForm` works with your existing `QuoatationFormWrapper`
2. All components are built with React Hook Form for optimal performance
3. Form state is managed centrally using FormProvider
4. Components are modular and can be used independently
5. Auto-calculation features reduce manual input errors

## Example Files

- `CompleteFormExample.tsx` - Full implementation example
- `QuotationFormExample.tsx` - Basic usage example
- `IntegratedQuotationForm.tsx` - Main integrated component

## Customization

Each component accepts standard React Hook Form props and can be customized:

- Add custom validation rules
- Modify styling through className props
- Extend data structures as needed
- Add custom field types

## Best Practices

1. Always wrap components in FormProvider
2. Use the integrated form for complete functionality
3. Validate data before submission
4. Handle loading states during API calls
5. Provide user feedback for form actions
