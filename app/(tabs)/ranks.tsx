import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RanksScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.text}>Ranks</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f1ea' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#1d2d29', fontSize: 20, fontWeight: '700' },
});
