import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export const loadHtmlTemplate = async (templateName) => {
  try {
    // In development, we'll use a local server URL for hot reloading
    if (__DEV__) {
      const response = await fetch(
        `http://localhost:3000/templates/${templateName}.html`
      );
      if (response.ok) {
        return await response.text();
      }
    }

    // In production, load from assets
    const asset = Asset.fromModule(
      require(`../assets/templates/quotation.html`)
    );
    await asset.downloadAsync();
    return await FileSystem.readAsStringAsync(asset.localUri);
  } catch (error) {
    console.error("Error loading HTML template:", error);
    return null;
  }
};
