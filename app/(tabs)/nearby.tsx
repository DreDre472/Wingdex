import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  Bell,
  Bird,
  CheckCircle2,
  Clock3,
  Footprints,
  MapPin,
  Navigation,
  UsersRound,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NearbyMap } from '../../src/components/NearbyMap';
import { PageHeader, PageHeaderAction } from '../../src/components/PageHeader';
import type { NearbyMapSighting } from '../../src/components/nearbyMapTypes';
import { getCurrentLocation, type UserLocation } from '../../src/services/location';
import { colors } from '../../src/theme';

const sightings: NearbyMapSighting[] = [
  {
    id: 'robin',
    name: 'American Robin',
    scientificName: 'Turdus migratorius',
    latitude: 45.5242,
    longitude: -122.6253,
    distance: '0.3 mi',
    time: '2 min ago',
    note: 'Singing from the big oak near the garden path.',
    observer: 'Maya R.',
    birders: 4,
  },
  {
    id: 'chickadee',
    name: 'Black-capped Chickadee',
    scientificName: 'Poecile atricapillus',
    latitude: 45.5209,
    longitude: -122.6218,
    distance: '0.5 mi',
    time: '8 min ago',
    note: 'A lively pair moving through the cedar grove.',
    observer: 'Sam L.',
    birders: 3,
  },
  {
    id: 'flicker',
    name: 'Northern Flicker',
    scientificName: 'Colaptes auratus',
    latitude: 45.5189,
    longitude: -122.6277,
    distance: '0.7 mi',
    time: '14 min ago',
    note: 'Foraging on the lawn along the east trail.',
    observer: 'Jordan P.',
    birders: 2,
  },
  {
    id: 'jay',
    name: "Steller's Jay",
    scientificName: 'Cyanocitta stelleri',
    latitude: 45.5228,
    longitude: -122.6301,
    distance: '0.4 mi',
    time: '21 min ago',
    note: 'Spotted near the rhododendron garden.',
    observer: 'Alex W.',
    birders: 5,
  },
];

export default function NearbyScreen() {
  const [selectedSightingId, setSelectedSightingId] = useState('robin');
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);
  const selectedSighting =
    sightings.find((sighting) => sighting.id === selectedSightingId) ?? sightings[0];

  const requestLocation = async () => {
    setRequestingLocation(true);
    setLocationError(null);
    try {
      setLocation(await getCurrentLocation());
    } catch (error) {
      setLocationError(
        error instanceof Error ? error.message : 'Could not get your location. Please try again.',
      );
    } finally {
      setRequestingLocation(false);
    }
  };

  const openDirections = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedSighting.latitude},${selectedSighting.longitude}&travelmode=walking`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open directions', 'Please try again or open your maps app.');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Nearby"
          subtitle="A little closer to the wild"
          accessory={
            <PageHeaderAction
              onPress={() => router.push('/notifications')}
              accessibilityLabel="Open notifications"
            >
              <Bell color={colors.ink} size={21} strokeWidth={2} />
              <View style={styles.notificationDot} />
            </PageHeaderAction>
          }
        />

        <Pressable
          style={({ pressed }) => [styles.locationPanel, pressed && styles.pressed]}
          onPress={() => void requestLocation()}
          disabled={requestingLocation}
          accessibilityRole="button"
          accessibilityLabel="Use my current location"
        >
          <View style={styles.locationIcon}>
            {requestingLocation ? (
              <ActivityIndicator color={colors.inkSoft} size="small" />
            ) : (
              <MapPin color={colors.inkSoft} size={18} strokeWidth={2.2} />
            )}
          </View>
          <View style={styles.locationCopy}>
            <Text style={styles.locationName}>
              {location ? 'Your location' : 'Use my location'}
            </Text>
            <Text style={styles.locationMeta}>
              {location
                ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                : 'Tap to allow access and center the map'}
            </Text>
          </View>
          <Navigation color={colors.inkSoft} size={18} />
        </Pressable>
        {locationError && <Text style={styles.locationError}>{locationError}</Text>}

        <View style={styles.mapHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>FIELD NOTES</Text>
            <Text style={styles.mapTitle}>Around the area</Text>
          </View>
          <View style={styles.mapBadge}>
            <View style={styles.mapDot} />
            <Text style={styles.mapBadgeText}>OPEN MAP</Text>
          </View>
        </View>

        <NearbyMap
          location={location}
          sightings={sightings}
          selectedSightingId={selectedSighting.id}
          onSelectSighting={setSelectedSightingId}
        />

        <View style={styles.sightingCard}>
          <View style={styles.sightingTop}>
            <View style={styles.birdArtwork}>
              <View style={styles.artworkHalo} />
              <Bird color={colors.coral} size={34} strokeWidth={1.8} />
              <View style={styles.artworkCaption}>
                <Text style={styles.artworkCaptionText}>FIELD</Text>
              </View>
            </View>
            <View style={styles.sightingInfo}>
              <Text style={styles.cardEyebrow}>SPOTTED NEARBY</Text>
              <Text style={styles.speciesName}>{selectedSighting.name}</Text>
              <Text style={styles.scientificName}>{selectedSighting.scientificName}</Text>
              <View style={styles.sightingMeta}>
                <View style={styles.metaItem}>
                  <MapPin color={colors.muted} size={13} />
                  <Text style={styles.metaText}>{selectedSighting.distance}</Text>
                </View>
                <View style={styles.metaSeparator} />
                <View style={styles.metaItem}>
                  <Clock3 color={colors.muted} size={13} />
                  <Text style={styles.metaText}>{selectedSighting.time}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.observationNote}>“{selectedSighting.note}”</Text>
          <View style={styles.communityRow}>
            <CheckCircle2 color={colors.inkSoft} size={15} strokeWidth={2.2} />
            <Text style={styles.observerText}>{selectedSighting.observer}</Text>
            <View style={styles.communityDivider} />
            <UsersRound color={colors.muted} size={14} />
            <Text style={styles.birderCount}>{selectedSighting.birders} nearby birders</Text>
          </View>
          <Pressable
            onPress={() => void openDirections()}
            style={({ pressed }) => [styles.directionsButton, pressed && styles.buttonPressed]}
            accessibilityRole="link"
            accessibilityLabel={`Get walking directions to ${selectedSighting.name} sighting`}
          >
            <Footprints color={colors.white} size={18} strokeWidth={2.2} />
            <Text style={styles.directionsText}>Get walking directions</Text>
            <Navigation color={colors.white} size={17} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.mapFooter}>
          <MapPin color={colors.inkSoft} size={14} />
          <Text style={styles.footerText}>
            Sample community sightings · your location stays on this device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 44,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  locationPanel: {
    minHeight: 68,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFF0EA',
    marginBottom: 8,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EDF2EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  locationCopy: { flex: 1 },
  locationName: { color: colors.ink, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  locationMeta: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  locationError: { color: colors.coral, fontSize: 11, lineHeight: 16, marginBottom: 12 },
  mapHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 11,
    paddingHorizontal: 2,
  },
  sectionEyebrow: { color: colors.inkSoft, fontSize: 9, lineHeight: 12, letterSpacing: 1.5, fontWeight: '800' },
  mapTitle: { color: colors.ink, fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.3, marginTop: 2 },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E8EEE4',
    marginBottom: 2,
  },
  mapDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: colors.inkSoft },
  mapBadgeText: { color: colors.inkSoft, fontSize: 8, lineHeight: 10, letterSpacing: 0.8, fontWeight: '800' },
  sightingCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#2D4135',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  sightingTop: { flexDirection: 'row', alignItems: 'center' },
  birdArtwork: {
    width: 66,
    height: 70,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F7E5DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  artworkHalo: { position: 'absolute', width: 47, height: 47, borderRadius: 24, backgroundColor: '#F1D3C3', top: 9, left: 10 },
  artworkCaption: { position: 'absolute', bottom: 5, alignSelf: 'center', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.62)' },
  artworkCaptionText: { color: colors.coral, fontSize: 6, letterSpacing: 1, fontWeight: '800' },
  sightingInfo: { flex: 1, minWidth: 0 },
  cardEyebrow: { color: colors.inkSoft, fontSize: 8, lineHeight: 11, letterSpacing: 1, fontWeight: '800', marginBottom: 2 },
  speciesName: { color: colors.ink, fontSize: 17, lineHeight: 21, fontWeight: '800', letterSpacing: -0.4 },
  scientificName: { color: colors.muted, fontSize: 10, lineHeight: 14, fontStyle: 'italic' },
  sightingMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 7 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  metaSeparator: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#B9C2B9' },
  observationNote: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 10, marginBottom: 9 },
  communityRow: { flexDirection: 'row', alignItems: 'center', minHeight: 19, marginBottom: 11, gap: 5 },
  observerText: { color: colors.inkSoft, fontSize: 10, fontWeight: '700' },
  communityDivider: { width: 1, height: 13, backgroundColor: colors.line, marginHorizontal: 3 },
  birderCount: { color: colors.muted, fontSize: 9, fontWeight: '600', marginLeft: 1 },
  directionsButton: {
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  buttonPressed: { backgroundColor: colors.inkSoft, transform: [{ scale: 0.99 }] },
  directionsText: { color: colors.white, fontSize: 12, fontWeight: '700', letterSpacing: 0.1 },
  mapFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  footerText: { color: colors.muted, fontSize: 10, lineHeight: 15 },
  pressed: { opacity: 0.8 },
});
