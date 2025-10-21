// storage/quotationDrafts.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (tripId) => `quotationDraft:${tripId}`;

/** Save draft data locally */
export async function saveQuotationDraft(tripId, data) {
  try {
    const payload = JSON.stringify({ v: 1, updatedAt: Date.now(), data });
    await AsyncStorage.setItem(key(tripId), payload);
  } catch (e) {
    console.warn('Failed to save draft', e);
  }
}

/** Load saved draft (if any) */
export async function loadQuotationDraft(tripId) {
  try {
    const raw = await AsyncStorage.getItem(key(tripId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data;
  } catch (e) {
    console.warn('Failed to load draft', e);
    return null;
  }
}

/** Clear a trip’s draft */
export async function clearQuotationDraft(tripId) {
  try {
    await AsyncStorage.removeItem(key(tripId));
  } catch (e) {
    console.warn('Failed to clear draft', e);
  }
}
