import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bird as BirdIcon, Compass, Database } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BirdObservationRow } from '../../src/components/BirdObservationRow';
import { birdRegions, type BirdRegion } from '../../src/data/regions';
import { useSavedBirds } from '../../src/hooks/useSavedBirds';
import { colors } from '../../src/theme';

const categories = ['All', ...birdRegions] as const;

export default function PokedexScreen() {
  const [selectedRegion, setSelectedRegion] = useState<'All' | BirdRegion>('All');
  const { observations, storageError } = useSavedBirds();
  const filteredObservations = observations.filter((observation) => selectedRegion === 'All' || observation.regions.includes(selectedRegion));
  const identifiedCount = observations.filter((observation) => observation.commonName !== null).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>WINGDEX / FIELD UNIT 01</Text>
          <Text style={styles.title}>Pokedex</Text>
        </View>
        <View style={styles.headerIcon}><Database color={colors.white} size={21} /></View>
      </View>

      <View style={styles.device}>
        <View style={styles.deviceTop}>
          <View style={styles.lens} />
          <View style={styles.indicatorGroup}>
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.indicatorDim]} />
          </View>
          <Text style={styles.deviceCode}>COLLECTION MODULE 01</Text>
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryIcon}><BirdIcon color="#D9E8D8" size={21} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>IDENTIFIED OBSERVATIONS</Text>
            <Text style={styles.summaryCount}>{identifiedCount.toString().padStart(2, '0')} <Text style={styles.summaryTotal}>/ {observations.length.toString().padStart(2, '0')} SIGHTINGS</Text></Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${observations.length ? (identifiedCount / observations.length) * 100 : 0}%` }]} /></View>
        </View>
      </View>

      {storageError && <Text style={styles.error}>Your local collection could not be read. Please reopen the app and try again.</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map((category) => {
          const selected = selectedRegion === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedRegion(category)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.category, selected && styles.categorySelected]}
            >
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filteredObservations.length > 0 ? (
        <View style={styles.list}>
          {filteredObservations.map((observation) => (
            <BirdObservationRow key={observation.id} observation={observation} onOpen={() => router.push(`/bird/${observation.id}`)} />
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><BirdIcon color={colors.ink} size={27} /></View>
          <Text style={styles.emptyTitle}>{selectedRegion === 'All' ? 'Your field notes start here' : `No birds in ${selectedRegion}`}</Text>
          <Text style={styles.emptyBody}>Identified sightings and unknown attempts appear here.</Text>
          <Pressable onPress={() => router.push('/birds')} style={styles.browseButton} accessibilityRole="button">
            <Compass color={colors.white} size={16} />
            <Text style={styles.browseLabel}>Browse birds</Text>
          </Pressable>
        </View>
      )}
      <Text style={styles.localNote}>Ranges are approximate species ranges, not sighting locations. Saved on this device.</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  eyebrow: { color: colors.coral, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: colors.ink, fontFamily: 'Georgia', fontSize: 29, marginTop: 4 },
  headerIcon: { width: 42, height: 42, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  device: { backgroundColor: '#C84E3F', borderWidth: 1, borderColor: '#B24034', borderBottomWidth: 4, borderBottomColor: '#98392F', padding: 11, marginBottom: 3 },
  deviceTop: { height: 28, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 3, marginBottom: 8 },
  lens: { width: 17, height: 17, borderWidth: 2, borderColor: '#F4B2A2', backgroundColor: '#4E9DB2' },
  indicatorGroup: { flexDirection: 'row', gap: 4 },
  indicator: { width: 6, height: 6, backgroundColor: '#F2CF67' },
  indicatorDim: { backgroundColor: '#9C332C' },
  deviceCode: { color: '#F8D5CE', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginLeft: 'auto' },
  summary: { minHeight: 92, borderWidth: 3, borderColor: '#263D36', backgroundColor: '#BBD5BD', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, overflow: 'hidden' },
  summaryIcon: { width: 38, height: 38, backgroundColor: '#34584A', alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { color: '#38564D', fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  summaryCount: { color: '#17382F', fontFamily: 'Georgia', fontSize: 23, marginTop: 3 },
  summaryTotal: { color: '#38564D', fontFamily: 'System', fontSize: 10 },
  categories: { gap: 7, paddingTop: 16, paddingBottom: 2 },
  category: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 11, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  categorySelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  categoryText: { color: colors.inkSoft, fontSize: 11, fontWeight: '700' },
  categoryTextSelected: { color: colors.white },
  progressTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: '#FFFFFF88' },
  progressFill: { height: '100%', backgroundColor: '#D95D45' },
  list: { marginTop: 18 },
  error: { color: colors.danger, fontSize: 12, marginTop: 14 },
  empty: { alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, paddingVertical: 27, paddingHorizontal: 18, marginTop: 18 },
  emptyIcon: { width: 54, height: 54, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  emptyTitle: { color: colors.ink, fontFamily: 'Georgia', fontSize: 20, textAlign: 'center' },
  emptyBody: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
  browseButton: { minHeight: 42, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.ink, marginTop: 17 },
  browseLabel: { color: colors.white, fontSize: 12, fontWeight: '700' },
  localNote: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 20 },
});