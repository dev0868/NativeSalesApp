import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FormProvider } from 'react-hook-form';
import SimpleQuotationWrapper from './SimpleQuotationWrapper';
import BasicDetails from './BasicDetails';
import CostCalculator from './CostCalculator';
import HotelsSection from './HotelsSection';
import InclusionsExclusions from './InclusionsExclusionsNew';
import FlightSection from './FlightSection';
import ItinerarySection from './ItinerarySectionNew';

import { useQuotationDraft } from '@/hooks/useQuotationDraft'; // your AsyncStorage autosave hook
import { clearQuotationDraft } from '@/storage/quotationDrafts';

const calculateTravelEndDate = (startDate, days) => {
  if (!startDate || !days) return '';
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
};

const IntegratedQuotationForm = ({ onSubmit, initialData = {}, lead }) => {

  const tripId = lead?.TripId || '';
const userData={
  CompanyId:'12345',
  AssignDate: new Date().toISOString(),
  AssignDateKey: +new Date().toISOString().slice(0,10).replace(/-/g,''),


}
  // Build defaults ONCE; changing this object each render causes RHF to rethink everything.
  const defaults = useMemo(
    () => ({
      TripId: tripId,
      "Client-Name": lead?.ClientLeadDetails?.FullName || '',
      "Client-Contact": lead?.ClientLeadDetails?.Contact || '',
      "Client-Email": lead?.ClientLeadDetails?.Email || '',
      TravelDate: lead?.ClientLeadDetails?.TravelDate || '',
      TravelDateKey: +new Date(lead?.ClientLeadDetails?.TravelDate).toISOString().slice(0,10).replace(/-/g,''),
      AssignDate: lead?.AssignDate || '',
      NoOfPax: lead?.ClientLeadDetails?.Pax || '',
      Child: lead?.ClientLeadDetails?.Child || '',
      Infant: lead?.ClientLeadDetails?.Infant || '0',
      Budget: lead?.ClientLeadDetails?.Budget || '',
      DepartureCity: lead?.ClientLeadDetails?.DepartureCity || '',
      DestinationName: lead?.ClientLeadDetails?.DestinationName || '',
      IsMultiDestination: false,
      Destinations: lead?.ClientLeadDetails?.DestinationName ? [lead?.ClientLeadDetails?.DestinationName] : [],
      Days: lead?.ClientLeadDetails?.Days === '' ? 2 : +lead?.ClientLeadDetails?.Days,
      Nights: lead?.ClientLeadDetails?.Days === '' ? 1 : lead?.ClientLeadDetails?.Days - 1,
      PriceType: 'Total',
      Currency: 'INR',
      Costs:{
       LandPackageCost: 0,
       VisaCost: 0,
       FlightCost: 0,
       GSTAmount: 0,
       TCSAmount: 0,
       TotalCost: 0,
       TotalTax: 0
    
      },
      GST: {
        Enabled: true,
        WaivedOffAmount: 0,
        WaivedOffOtps: []
      },
      TCS: {
        Enabled: true,
        WaivedOffAmount: 0,
        WaivedOffOtps: []
      },
      Images: {
    Inclusions: [],
    Flights: []
  },

      Hotels: [
        {
          Nights: [],
          Name: '',
          City: '',
          RoomType: '',
          Category: 0,
          Meals: [],
          CheckInDate : '',
          CheckInDateKey:null,
          CheckOutDate: '',
          CheckOutDateKey:null,
          Comments: '',
        },
      ],
      Inclusions: [],
      Exclusions: [],
      Itinearies: [
        {
          Date: "",
          DateKey: null,
          Title: "",
          Activities: "",
          ImageUrl: "",
          Description: "",
        },
    
      ],
    
      CreatedAt: new Date().toISOString(),
      LastUpdateStatus:{
        UpdatedBy: 'Draft',
        UpdatedTime: new Date().toISOString(),
      },
      TravelEndDate: calculateTravelEndDate(
        lead?.ClientLeadDetails?.TravelDate,
        Number(lead?.ClientLeadDetails?.Days)
      ),
      TravelEndDateKey: +new Date(lead?.ClientLeadDetails?.TravelDate).toISOString().slice(0,10).replace(/-/g,''),
      ...initialData,
    }),
    [tripId, lead, initialData]
  );

  const { methods, loading } = useQuotationDraft(tripId, defaults);

  const sections = useMemo(
    () => [
      { key: 'basic', Component: BasicDetails },
      { key: 'cost', Component: CostCalculator },
      { key: 'hotels', Component: HotelsSection },
      { key: 'incl-excl', Component: InclusionsExclusions },
      { key: 'flights', Component: FlightSection },
      { key: 'itinerary', Component: ItinerarySection },
    ],
    []
  );

  const handleSubmit = methods.handleSubmit(async (data) => {
    console.log(data)

    await onSubmit({...data,...userData});
    await clearQuotationDraft(tripId); // clear draft only on success
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      {/* IMPORTANT: remove value={formValues} and onChange={...}
         Sections will read/write through RHF context themselves */}
      <SimpleQuotationWrapper
        sections={sections}
        onSubmit={handleSubmit}
        header={null}
        footer={null}
      />
    </FormProvider>
  );
};

export default IntegratedQuotationForm;
