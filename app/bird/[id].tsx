import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBird } from '../../src/data/birds';
import { useSavedBirds } from '../../src/hooks/useSavedBirds';
import { colors, rarityColors } from '../../src/theme';

export default function BirdDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bird = getBird(id);
  const { savedIds, observations, toggle } = useSavedBirds();
  const saved = bird ? savedIds.includes(bird.id) : false;
  const identifiedObservation = bird && observations.find((observation) =>
    observation.photoUri && (
      observation.scientificName?.toLowerCase() === bird.scientificName.toLowerCase() ||
      observation.commonName?.toLowerCase() === bird.name.toLowerCase()
    )
  );

  if (!bird) {
    return (
      <SafeAreaView style={styles.notFound} edges={['top', 'bottom']}>
        <Text style={styles.notFoundTitle}>Bird not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}><ArrowLeft color={colors.ink} size={18} /><Text style={styles.backLabel}>Go back</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
        <ArrowLeft color={colors.ink} size={19} />
        <Text style={styles.backLabel}>FIELD GUIDE</Text>
      </Pressable>
      {identifiedObservation?.photoUri ? (
        <Image source={{ uri: identifiedObservation.photoUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.unknownImage]}><Text style={styles.question}>?</Text></View>
      )}
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>PALAWAN / SPECIES RECORD</Text>
        <Text style={styles.title}>{bird.name}</Text>
        <Text style={styles.scientific}>{bird.scientificName}</Text>
        <View style={styles.badges}>
          <View style={[styles.rarityDot, { backgroundColor: rarityColors[bird.rarity] }]} />
          <Text style={styles.rarity}>{bird.rarity}</Text>
          <View style={styles.separator} />
          <Text style={styles.habitat}>{bird.habitat}</Text>
        </View>
      </View>

      <View style={styles.rule} />
      <Text style={styles.sectionLabel}>FIELD NOTE</Text>
      <Text style={styles.description}>{bird.description}</Text>
      <Text style={styles.provisional}>Rarity is a starter estimate and needs review against local sightings.</Text>

      <Pressable onPress={() => void toggle(bird.id)} style={styles.saveButton} accessibilityRole="button">
        {saved ? <BookmarkCheck color={colors.white} size={17} /> : <Bookmark color={colors.white} size={17} />}
        <Text style={styles.saveLabel}>{saved ? 'Remove from Pokedex' : 'Add to Pokedex'}</Text>
      </Pressable>

      <View style={styles.creditBlock}>
        <Text style={styles.sectionLabel}>IMAGE CREDIT</Text>
        <Text style={styles.creditText}>{bird.imageCredit} · {bird.imageLicense}</Text>
        <Pressable onPress={() => void Linking.openURL(bird.imageSourceUrl)} style={styles.sourceLink} accessibilityRole="link">
          <Text style={styles.sourceLabel}>Wikimedia Commons</Text><ExternalLink color={colors.inkSoft} size={13} />
        </Pressable>
        <Pressable onPress={() => void Linking.openURL(bird.sourceUrl)} style={styles.sourceLink} accessibilityRole="link">
          <Text style={styles.sourceLabel}>Species reference</Text><ExternalLink color={colors.inkSoft} size={13} />
        </Pressable>
      </View>
      <Text style={styles.localNote}>Photo attribution and license are shown with each image.</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 35 },
  backButton: { minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  backLabel: { color: colors.inkSoft, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  image: { width: '100%', height: 255, borderRadius: 8, backgroundColor: colors.leaf },
  unknownImage: { alignItems: 'center', justifyContent: 'center' },
  question: { color: colors.ink, fontFamily: 'Georgia', fontSize: 76, lineHeight: 84 },
  titleBlock: { paddingTop: 18 },
  eyebrow: { color: colors.coral, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.ink, fontFamily: 'Georgia', fontSize: 27, lineHeight: 32, marginTop: 6 },
  scientific: { color: colors.muted, fontSize: 13, fontStyle: 'italic', marginTop: 5 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 13 },
  rarityDot: { width: 8, height: 8, borderRadius: 4 },
  rarity: { color: colors.inkSoft, fontSize: 12, textTransform: 'capitalize' },
  separator: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.muted, marginHorizontal: 2 },
  habitat: { color: colors.muted, fontSize: 12 },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: 18 },
  sectionLabel: { color: colors.coral, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  description: { color: colors.ink, fontSize: 15, lineHeight: 23, marginTop: 8 },
  provisional: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 11 },
  saveButton: { minHeight: 48, backgroundColor: colors.ink, borderRadius: 7, marginTop: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  saveLabel: { color: colors.white, fontSize: 13, fontWeight: '700' },
  creditBlock: { marginTop: 24, padding: 14, borderRadius: 7, backgroundColor: colors.leaf },
  creditText: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 6 },
  sourceLink: { minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 7 },
  sourceLabel: { color: colors.ink, fontSize: 11, textDecorationLine: 'underline' },
  localNote: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 13, textAlign: 'center' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  notFoundTitle: { color: colors.ink, fontFamily: 'Georgia', fontSize: 24 },
});