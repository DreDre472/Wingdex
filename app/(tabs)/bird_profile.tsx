import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Bell, User, MapPin, Calendar, Info, CheckCircle2, Ruler, Play } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme';
import { birdImages } from '../../src/data/bird-images';

export default function BirdProfileScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, we would get the bird ID from the route params
  // For now, I'll use a sample bird for the layout demonstration
  const bird = {
    name: 'Palawan Peacock-pheasant',
    scientificName: 'Polyplectron napoleonis',
    length: '45–55 cm',
    wingspan: '60–70 cm',
    weight: '600–900 g',
    family: 'Phasianidae',
    rarity: 'Endemic',
    habitat: 'Lowland Rainforest',
    description: 'The Palawan peacock-pheasant is a species of pheasant endemic to the island of Palawan in the Philippines. It is known for its striking plumage and secretive nature in the dense rainforests.',
    location: 'Palawan, Philippines',
    lastSeen: 'October 2026'
  };

  const userSighting = {
    firstSpotted: 'October 12, 2026',
    location: 'Mt. Mantalingahan, Palawan',
    coord: '11.55° N, 119.12° E'
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
          <ArrowLeft color={colors.ink} size={22} strokeWidth={2} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Notifications">
            <Bell color={colors.ink} size={22} strokeWidth={2} />
          </Pressable>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="User Profile">
            <User color={colors.ink} size={22} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={birdImages['palawan-peacock-pheasant'] || { uri: 'https://via.placeholder.com/400' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleGroup}>
            <Text style={styles.birdName}>{bird.name}</Text>
            <Text style={styles.scientificName}>{bird.scientificName}</Text>
            <View style={styles.measurementsRow}>
              <View style={styles.measurementItem}>
                <Ruler color={colors.inkSoft} size={12} />
                <Text style={styles.measurementText}>{bird.length} • {bird.wingspan} • {bird.weight}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{bird.rarity}</Text>
            </View>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeTextSecondary}>{bird.family}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MapPin color={colors.leaf} size={16} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{bird.location}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar color={colors.leaf} size={16} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Last Seen</Text>
                <Text style={styles.detailValue}>{bird.lastSeen}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionHeader}>
              <Info color={colors.ink} size={18} />
              <Text style={styles.descriptionTitle}>About this species</Text>
            </View>
            <Text style={styles.descriptionText}>{bird.description}</Text>
          </View>

          <View style={styles.tabContainer}>
            <View style={styles.tabRow}>
              {['Overview', 'Habitat', 'Seasonality'].map((tab) => (
                <Pressable
                  key={tab}
                  style={[styles.tab, activeTab === tab.toLowerCase() && styles.tabActive]}
                  onPress={() => setActiveTab(tab.toLowerCase())}
                >
                  <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.tabContent}>
              {activeTab === 'overview' && (
                <View style={styles.overviewContent}>
                  <Text style={styles.overviewDescription}>
                    {bird.description}
                  </Text>
                  <View style={styles.habitsSection}>
                    <Text style={styles.habitsTitle}>Habits & Behavior</Text>
                    <Text style={styles.habitsText}>
                      The {bird.name} is known for its secretive nature and territorial behavior. It typically forages on the forest floor, feeding on fallen fruits, seeds, and insects.
                    </Text>
                  </View>
                  <View style={styles.audioPlayer}>
                    <View style={styles.audioInfo}>
                      <View style={styles.playButton}>
                        <Play color={colors.white} size={16} fill={colors.white} />
                      </View>
                      <Text style={styles.audioLabel}>Bird Call</Text>
                    </View>
                    <View style={styles.waveform}>
                      {[...Array(15)].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.waveformBar,
                            { height: Math.random() * 12 + 4 }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
              {activeTab === 'habitat' && (
                <Text style={styles.tabTextContent}>Detailed information about the {bird.habitat} and the specific environment the {bird.name} thrives in.</Text>
              )}
              {activeTab === 'seasonality' && (
                <Text style={styles.tabTextContent}>Detailed information about the seasonality and migration patterns for the {bird.name}.</Text>
              )}
            </View>
          </View>

          <View style={styles.personalSection}>
            <Pressable style={styles.historyButton}>
              <View style={styles.buttonIcon}>
                <Calendar color={colors.white} size={18} />
              </View>
              <View style={styles.historyTextGroup}>
                <Text style={styles.historyMainText}>User Personal sighting history</Text>
                <Text style={styles.historySubText}>First spotted {userSighting.firstSpotted} at {userSighting.location}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.noteButton}>
              <View style={styles.buttonIcon}>
                <Info color={colors.ink} size={18} />
              </View>
              <View style={styles.noteTextGroup}>
                <Text style={styles.buttonTextInk}>Personal field note</Text>
                <Text style={styles.noteSubText}>Tap to add your observations</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7F1' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    zIndex: 10,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: { paddingBottom: 40 },
  heroSection: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(246, 247, 225, 0)', // Transparent, but can add gradient if needed
  },
  infoSection: {
    marginTop: -30,
    backgroundColor: '#F6F7F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 30,
    minHeight: 600,
  },
  titleGroup: { alignItems: 'center', marginBottom: 16 },
  measurementsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 4
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  measurementText: {
    fontSize: 12,
    color: colors.inkSoft,
    fontWeight: '500'
  },
  birdName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    fontFamily: 'Georgia',
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.inkSoft,
    marginTop: 4,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: colors.leaf,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSecondary: {
    backgroundColor: '#E8EEE5',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextSecondary: {
    color: colors.inkSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E6DC',
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '700',
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  tabContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF1EB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  tabTextActive: {
    color: colors.ink,
  },
  tabContent: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E6DC',
  },
  tabTextContent: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  overviewContent: { gap: 20 },
  overviewDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  habitsSection: { gap: 8 },
  habitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  habitsText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.ink,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    justifyContent: 'flex-end',
  },
  waveformBar: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  saveButton: {
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  personalSection: {
    gap: 12,
    marginTop: 8,
  },
  historyButton: {
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E6DC',
    gap: 12,
  },
  buttonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextInk: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  historyTextGroup: { flex: 1, gap: 2 },
  historyMainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  historySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '400',
  },
  noteTextGroup: { flex: 1, gap: 2 },
  noteSubText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '400',
  },
});
