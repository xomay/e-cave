import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';


export default function RootLayout() {
  /*const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log('Creating database and tables...');
    await db.execAsync('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);');
  };*/
  return (
    //onInit={createDbIfNeeded} is a callback that will be called when the database is opened
    <SQLiteProvider databaseName="cave_dev3.db" assetSource={{ assetId: require('../assets/cave_dev3.db') }}>
      <Stack>
        {/*<Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="wineDetails" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="editPage" options={{ headerShown: false}} />
        <Stack.Screen name="+not-found"/>
      </Stack>
    </SQLiteProvider>
  );
}
