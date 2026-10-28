import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  Bell,
  Bird,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Footprints,
  MapPin,
  Navigation,
  UsersRound,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme';

type Sighting = {
  id: string;
  name: string;
  scientificName: string;
  top: number;
  left: number;
  distance: string;
  time: string;
  note: string;
  observer: string;
  birders: number;
};

const sightings: Sighting[] = [
  {
    id: 'robin',
    name: 'American Robin',
    scientificName: 'Turdus migratorius',
    top: 31,
    left: 36,
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
    top: 19,
    left: 72,
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
    top: 38,
    left: 78,
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
    top: 23,
    left: 19,
    distance: '0.4 mi',
    time: '21 min ago',
    note: 'Spotted near the rhododendron garden.',
    observer: 'Alex W.',
    birders: 5,
  },
];

const filters = ['Birds · 12', 'Today', 'Within 2 km'] as const;
type Filter = (typeof filters)[number];

export default function NearbyScreen() {
  const { height } = useWindowDimensions();
  const [selectedSightingId, setSelectedSightingId] = useState('robin');
  const [activeFilters, setActiveFilters] = useState<Filter[]>(['Birds · 12']);
  const selectedSighting =
    sightings.find((sighting) => sighting.id === selectedSightingId) ?? sightings[0];

  const toggleFilter = (filter: Filter) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((activeFilter) => activeFilter !== filter)
        : [...current, filter],
    );
  };

  const openDirections = async () => {
    const url =
      'https://www.google.com/maps/dir/?api=1&destination=Laurelhurst+Park,+Portland,+OR&travelmode=walking';
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Could not open directions',
        'Please try again or search for Laurelhurst Park, Portland in your maps app.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nearby</Text>
            <Text style={styles.subtitle}>A little closer to the wild</Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
          >
            <Bell color={colors.ink} size={21} strokeWidth={2} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.locationPanel, pressed && styles.pressed]}
          onPress={() =>
            Alert.alert(
              'Sample location',
              'This preview uses Laurelhurst Park as a sample location. Your device location is not being accessed.',
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Sample location: Laurelhurst Park, Portland. Tap for details."
        >
          <View style={styles.locationIcon}>
            <MapPin color={colors.inkSoft} size={18} strokeWidth={2.2} />
          </View>
          <View style={styles.locationCopy}>
            <Text style={styles.locationName}>Laurelhurst Park</Text>
            <Text style={styles.locationMeta}>Portland, Oregon · Sample location</Text>
          </View>
          <ChevronDown color={colors.muted} size={19} />
        </Pressable>

        <View style={styles.filterRow} accessibilityLabel="Sightings filters">
          {filters.map((filter) => {
            const active = activeFilters.includes(filter);
            return (
              <Pressable
                key={filter}
                onPress={() => toggleFilter(filter)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`${filter}${active ? ', selected' : ''}`}
              >
                {filter === 'Birds · 12' && (
                  <Bird
                    color={active ? colors.white : colors.inkSoft}
                    size={15}
                    strokeWidth={2}
                  />
                )}
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.mapHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>FIELD NOTES</Text>
            <Text style={styles.mapTitle}>Around the park</Text>
          </View>
          <View style={styles.sampleBadge}>
            <View style={styles.sampleDot} />
            <Text style={styles.sampleText}>DEMO MAP</Text>
          </View>
        </View>

        <View style={[styles.map, height <= 850 && styles.mapCompact]}>
          <View style={styles.mapMeadowA} />
          <View style={styles.mapMeadowB} />
          <View style={styles.mapMeadowC} />
          <View style={styles.pathOne} />
          <View style={styles.pathTwo} />
          <View style={styles.pathThree} />
          <View style={styles.roadOne} />
          <View style={styles.roadTwo} />
          <View style={styles.pond}>
            <View style={styles.pondShimmer} />
          </View>
          <View style={styles.groveOne}>
            <View style={styles.treeLarge} />
            <View style={[styles.treeSmall, styles.treeSmallOne]} />
            <View style={[styles.treeSmall, styles.treeSmallTwo]} />
            <View style={[styles.treeSmall, styles.treeSmallThree]} />
          </View>
          <View style={styles.groveTwo}>
            <View style={styles.treeLarge} />
            <View style={[styles.treeSmall, styles.treeSmallOne]} />
            <View style={[styles.treeSmall, styles.treeSmallTwo]} />
          </View>
          <Text style={[styles.mapLabel, styles.roseGardenLabel]}>ROSE GARDEN</Text>
          <Text style={[styles.mapLabel, styles.lawnLabel]}>CENTRAL LAWN</Text>
          <Text style={[styles.mapLabel, styles.trailLabel]}>WILLOW TRAIL</Text>

          <View style={styles.userMarker} accessibilityLabel="Sample park location">
            <View style={styles.userMarkerCore} />
          </View>
          <View style={styles.youLabel}>
            <Text style={styles.youLabelText}>YOU</Text>
          </View>

          {sightings.map((sighting) => {
            const selected = sighting.id === selectedSighting.id;
            return (
              <Pressable
                key={sighting.id}
                onPress={() => setSelectedSightingId(sighting.id)}
                style={({ pressed }) => [
                  styles.markerPosition,
                  { top: `${sighting.top}%`, left: `${sighting.left}%` },
                  pressed && styles.markerPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Show ${sighting.name} sighting`}
              >
                <View style={[styles.birdMarker, selected && styles.birdMarkerSelected]}>
                  <Bird
                    color={selected ? colors.white : colors.ink}
                    size={selected ? 19 : 16}
                    strokeWidth={2}
                  />
                </View>
                {selected && (
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText}>{sighting.name}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

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
              <View style={styles.verifiedIcon}>
                <CheckCircle2 color={colors.inkSoft} size={15} strokeWidth={2.2} />
              </View>
              <Text style={styles.observerText}>{selectedSighting.observer}</Text>
              <View style={styles.communityDivider} />
              <UsersRound color={colors.muted} size={14} />
              <Text style={styles.birderCount}>{selectedSighting.birders} nearby birders</Text>
            </View>

            <Pressable
              onPress={() => void openDirections()}
              style={({ pressed }) => [styles.directionsButton, pressed && styles.buttonPressed]}
              accessibilityRole="link"
              accessibilityLabel={`Get walking directions to Laurelhurst Park for ${selectedSighting.name} sighting`}
            >
              <Footprints color={colors.white} size={18} strokeWidth={2.2} />
              <Text style={styles.directionsText}>Get walking directions</Text>
              <Navigation color={colors.white} size={17} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <View style={styles.mapFooter}>
          <View style={styles.footerPin}>
            <MapPin color={colors.inkSoft} size={14} />
          </View>
          <Text style={styles.footerText}>Sightings are community-shared sample notes.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 44,
  },
  header: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#21352C',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
    marginBottom: 14,
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
  locationCopy: {
    flex: 1,
  },
  locationName: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  locationMeta: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 1,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 21,
  },
  filterChip: {
    height: 38,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E8EBE4',
  },
  filterChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filterText: {
    color: colors.inkSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  mapHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 11,
    paddingHorizontal: 2,
  },
  sectionEyebrow: {
    color: colors.inkSoft,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  mapTitle: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  sampleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E8EEE4',
    marginBottom: 2,
  },
  sampleDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.inkSoft,
  },
  sampleText: {
    color: colors.inkSoft,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  map: {
    height: 485,
    overflow: 'hidden',
    borderRadius: 25,
    backgroundColor: '#DDE8D6',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CFDAC8',
  },
  mapCompact: {
    height: 425,
  },
  mapMeadowA: {
    position: 'absolute',
    width: '64%',
    height: '45%',
    top: '-9%',
    left: '-11%',
    backgroundColor: '#D1E0CD',
    borderRadius: 140,
    transform: [{ rotate: '-18deg' }],
  },
  mapMeadowB: {
    position: 'absolute',
    width: '70%',
    height: '42%',
    top: '21%',
    right: '-21%',
    backgroundColor: '#D4E2CF',
    borderRadius: 150,
    transform: [{ rotate: '24deg' }],
  },
  mapMeadowC: {
    position: 'absolute',
    width: '83%',
    height: '44%',
    bottom: '13%',
    left: '-17%',
    backgroundColor: '#D3E1CE',
    borderRadius: 180,
    transform: [{ rotate: '11deg' }],
  },
  pathOne: {
    position: 'absolute',
    width: '135%',
    height: 22,
    left: '-19%',
    top: '36%',
    borderRadius: 30,
    backgroundColor: '#F6F1DF',
    transform: [{ rotate: '-20deg' }],
  },
  pathTwo: {
    position: 'absolute',
    width: '112%',
    height: 15,
    right: '-18%',
    top: '16%',
    borderRadius: 30,
    backgroundColor: '#F4EFDE',
    transform: [{ rotate: '34deg' }],
  },
  pathThree: {
    position: 'absolute',
    width: '116%',
    height: 14,
    left: '-12%',
    top: '59%',
    borderRadius: 30,
    backgroundColor: '#F4EFDE',
    transform: [{ rotate: '24deg' }],
  },
  roadOne: {
    position: 'absolute',
    width: '130%',
    height: 9,
    left: '-15%',
    top: '11%',
    borderRadius: 10,
    backgroundColor: '#C4CFBB',
    transform: [{ rotate: '-8deg' }],
  },
  roadTwo: {
    position: 'absolute',
    width: '100%',
    height: 8,
    right: '-31%',
    top: '48%',
    borderRadius: 10,
    backgroundColor: '#C4CFBB',
    transform: [{ rotate: '75deg' }],
  },
  pond: {
    position: 'absolute',
    width: 103,
    height: 63,
    left: '12%',
    top: '43%',
    borderRadius: 52,
    backgroundColor: '#BCD4CF',
    transform: [{ rotate: '-22deg' }],
    borderWidth: 2,
    borderColor: '#D9E5D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pondShimmer: {
    width: '58%',
    height: 2,
    borderRadius: 2,
    backgroundColor: '#DCE9DF',
    transform: [{ rotate: '-13deg' }],
  },
  groveOne: {
    position: 'absolute',
    top: '21%',
    left: '46%',
    width: 75,
    height: 65,
  },
  groveTwo: {
    position: 'absolute',
    top: '43%',
    right: '8%',
    width: 65,
    height: 57,
  },
  treeLarge: {
    position: 'absolute',
    width: 34,
    height: 34,
    left: 18,
    top: 11,
    borderRadius: 18,
    backgroundColor: '#9EB99B',
    borderWidth: 2,
    borderColor: '#C8D9C1',
  },
  treeSmall: {
    position: 'absolute',
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#AAC3A4',
    borderWidth: 2,
    borderColor: '#D4E1CF',
  },
  treeSmallOne: {
    top: 0,
    left: 4,
  },
  treeSmallTwo: {
    top: 34,
    left: 0,
  },
  treeSmallThree: {
    top: 37,
    left: 43,
  },
  mapLabel: {
    position: 'absolute',
    color: '#748C73',
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1,
    fontWeight: '800',
  },
  roseGardenLabel: {
    left: '8%',
    top: '19%',
  },
  lawnLabel: {
    left: '38%',
    top: '48%',
  },
  trailLabel: {
    right: '11%',
    top: '15%',
    transform: [{ rotate: '33deg' }],
  },
  userMarker: {
    position: 'absolute',
    width: 25,
    height: 25,
    left: '53%',
    top: '42%',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.64)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerCore: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#4C87A0',
    borderWidth: 2,
    borderColor: colors.white,
  },
  youLabel: {
    position: 'absolute',
    left: '58%',
    top: '43%',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.84)',
  },
  youLabelText: {
    color: '#477B91',
    fontSize: 7,
    letterSpacing: 0.7,
    fontWeight: '800',
  },
  markerPosition: {
    position: 'absolute',
    marginLeft: -18,
    marginTop: -18,
    alignItems: 'center',
    zIndex: 2,
  },
  markerPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.96 }],
  },
  birdMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E7EDE3',
    shadowColor: '#26392F',
    shadowOpacity: 0.16,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  birdMarkerSelected: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: colors.ink,
    borderColor: colors.white,
    borderWidth: 2,
  },
  markerLabel: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: colors.ink,
    shadowColor: '#20372B',
    shadowOpacity: 0.14,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  markerLabelText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  sightingCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#2D4135',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  sightingTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  artworkHalo: {
    position: 'absolute',
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: '#F1D3C3',
    top: 9,
    left: 10,
  },
  artworkCaption: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  artworkCaptionText: {
    color: colors.coral,
    fontSize: 6,
    letterSpacing: 1,
    fontWeight: '800',
  },
  sightingInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardEyebrow: {
    color: colors.inkSoft,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 2,
  },
  speciesName: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  scientificName: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontStyle: 'italic',
  },
  sightingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 7,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  metaSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#B9C2B9',
  },
  observationNote: {
    color: colors.inkSoft,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
    marginBottom: 9,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 19,
    marginBottom: 11,
  },
  verifiedIcon: {
    marginRight: 5,
  },
  observerText: {
    color: colors.inkSoft,
    fontSize: 10,
    fontWeight: '700',
  },
  communityDivider: {
    width: 1,
    height: 13,
    backgroundColor: colors.line,
    marginHorizontal: 8,
  },
  birderCount: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },
  directionsButton: {
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  buttonPressed: {
    backgroundColor: colors.inkSoft,
    transform: [{ scale: 0.99 }],
  },
  directionsText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  footerPin: {
    opacity: 0.75,
  },
  footerText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
  },
  pressed: {
    opacity: 0.8,
  },
});
