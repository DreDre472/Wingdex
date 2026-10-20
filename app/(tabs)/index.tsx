import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowUpRight, ChevronRight, ImagePlus, RotateCcw, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { birdImages } from '../../src/data/bird-images';
import { birds, getDailyFeaturedBird } from '../../src/data/birds';
import type { BirdObservation } from '../../src/services/collection';
import { useSavedBirds } from '../../src/hooks/useSavedBirds';
import { identifyBird, isIdentificationConfigured, minimumConfidence } from '../../src/services/identification';
import { colors } from '../../src/theme';

type PickedPhoto = {
  uri: string;
  name: string | null;
  mimeType: string | null;
};

export default function IdentifyScreen() {
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lastObservation, setLastObservation] = useState<BirdObservation | null>(null);
  const { addObservation } = useSavedBirds();
  const [featured, setFeatured] = useState(() => getDailyFeaturedBird());

  useEffect(() => {
    const now = new Date();
    const nextLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = setTimeout(() => setFeatured(getDailyFeaturedBird()), nextLocalMidnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [featured]);

  const pickPhoto = async () => {
    setMessage(null);
    setLastObservation(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
        exif: false,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setPhoto({ uri: asset.uri, name: asset.fileName ?? null, mimeType: asset.mimeType ?? null });
      }
    } catch {
      setMessage('Photo library could not be opened. Please try again.');
    }
  };

  const submitPhoto = async () => {
    if (!photo) return;
    setLoading(true);
    setMessage(null);
    try {
      const result = await identifyBird(photo.uri, photo.name, photo.mimeType);
      const identified = Boolean(
        result.commonName && result.scientificName && result.confidence >= minimumConfidence
      );
      const observation = await addObservation(result, identified ? photo.uri : null);
      setLastObservation(observation);
      setMessage(identified ? null : 'Could not confidently identify this bird. Saved without its photo.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Identification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const guideBird = lastObservation && birds.find((bird) =>
    bird.scientificName.toLowerCase() === lastObservation.scientificName?.toLowerCase() ||
    bird.name.toLowerCase() === lastObservation.commonName?.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>wingdex</Text>
          <Text style={styles.kicker}>FIELD NOTES / PALAWAN</Text>
        </View>
        <View style={styles.locationMark}><Text style={styles.locationText}>PH</Text></View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>A WILDLIFE COMPANION</Text>
        <Text style={styles.title}>Look closer.{ '\n' }Meet the birds.</Text>
      </View>

      <View style={styles.uploadPanel}>
        <View style={styles.uploadHeading}>
          <View style={styles.uploadIcon}><ImagePlus color={colors.ink} size={19} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadSectionTitle}>Identify a bird</Text>
            <Text style={styles.sectionSub}>Choose a photo from your library</Text>
          </View>
          <Sparkles color={colors.coral} size={17} />
        </View>

        {photo ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: photo.uri }} style={styles.preview} />
            <Pressable onPress={pickPhoto} style={styles.retakeButton} accessibilityRole="button" accessibilityLabel="Choose a different photo">
              <RotateCcw color={colors.white} size={16} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={pickPhoto} style={styles.pickArea} accessibilityRole="button">
            <View style={styles.pickGraphic}><ImagePlus color={colors.ink} size={26} /></View>
            <Text style={styles.pickTitle}>Choose a bird photo</Text>
            <Text style={styles.pickHint}>JPG, PNG or HEIC</Text>
          </Pressable>
        )}

        <Pressable
          onPress={photo ? submitPhoto : pickPhoto}
          disabled={loading}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, loading && styles.disabled]}
          accessibilityRole="button"
        >
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryLabel}>{photo ? 'Identify bird' : 'Select a photo'}</Text>}
          {!loading && <ArrowUpRight color={colors.white} size={18} />}
        </Pressable>
        <Text style={styles.privacyNote}>Your photo is only sent after you choose Identify.</Text>

        {message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
            {!isIdentificationConfigured() && <Text style={styles.messageDetail}>Connect a recognition API to enable live results.</Text>}
          </View>
        )}
        {lastObservation && (
          <Pressable onPress={() => router.push(`/bird/${lastObservation.id}`)} style={styles.resultCard} accessibilityRole="button" accessibilityLabel={`View ${lastObservation.commonName ?? 'unidentified bird'} sighting`}>
            {lastObservation.photoUri ? (
              <Image source={{ uri: lastObservation.photoUri }} style={styles.resultImage} />
            ) : (
              <View style={styles.unknownResult}><Text style={styles.unknownMark}>?</Text></View>
            )}
              <View style={styles.resultCopy}>
              <Text style={styles.resultKicker}>{lastObservation.commonName ? 'IDENTIFIED / SAVED' : 'UNKNOWN / SAVED'}</Text>
              <Text style={styles.resultName}>{lastObservation.commonName ?? 'Unidentified bird'}</Text>
              {lastObservation.scientificName && <Text style={styles.resultScientific}>{lastObservation.scientificName}</Text>}
              <Text style={styles.resultRarity}>{lastObservation.regions.join(', ') || 'Range unknown'}</Text>
            </View>
              <View style={styles.resultFooter}>
                <Text numberOfLines={2} style={styles.resultDescription}>{guideBird?.description ?? lastObservation.description ?? 'Open this saved sighting for its identification details.'}</Text>
                <View style={styles.resultLink}><Text style={styles.resultLinkText}>VIEW FIELD NOTE</Text><ChevronRight color={colors.ink} size={16} /></View>
              </View>
          </Pressable>
        )}
      </View>

      <View style={styles.featureHeading}>
        <View>
          <Text style={styles.eyebrow}>SPECIES SPOTLIGHT</Text>
          <Text style={styles.sectionTitle}>From the island</Text>
        </View>
        <Pressable onPress={() => router.push('/birds')} accessibilityRole="button" accessibilityLabel="Browse birds">
          <ArrowUpRight color={colors.ink} size={20} />
        </Pressable>
      </View>

      <Pressable onPress={() => router.push(`/bird/${featured.id}`)} style={styles.featureCard}>
        <Image source={birdImages[featured.id]} style={styles.featureImage} />
        <View style={styles.featureShade} />
        <View style={styles.featureMeta}>
          <Text style={styles.featureEyebrow}>PALAWAN / {featured.rarity.toUpperCase()}</Text>
          <Text style={styles.featureName}>{featured.name}</Text>
          <Text style={styles.featureScientific}>{featured.scientificName}</Text>
        </View>
      </Pressable>
      <Text style={styles.photoCredit}>Photo: {featured.imageCredit} · {featured.imageLicense}</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.ink, fontFamily: 'Georgia', fontSize: 26, fontWeight: '700' },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginTop: 1 },
  locationMark: { width: 38, height: 38, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.leafDeep },
  locationText: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  intro: { paddingTop: 28, paddingBottom: 20 },
  eyebrow: { color: colors.coral, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontFamily: 'Georgia', fontSize: 31, lineHeight: 36, marginTop: 7 },
  uploadPanel: { backgroundColor: colors.coral, borderWidth: 1, borderColor: colors.danger, borderBottomWidth: 4, borderBottomColor: colors.danger, padding: 13 },
  uploadHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  uploadIcon: { width: 36, height: 36, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  uploadSectionTitle: { color: colors.white, fontSize: 17, fontWeight: '700' },
  sectionSub: { color: colors.coralPale, fontSize: 12, marginTop: 3 },
  pickArea: { height: 156, borderWidth: 1, borderColor: colors.line, borderStyle: 'dashed', backgroundColor: '#F7F8F2', alignItems: 'center', justifyContent: 'center' },
  pickGraphic: { width: 48, height: 48, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  pickTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  pickHint: { color: colors.muted, fontSize: 11, marginTop: 4 },
  previewWrap: { height: 210, overflow: 'hidden', backgroundColor: colors.leaf },
  preview: { width: '100%', height: '100%', resizeMode: 'cover' },
  retakeButton: { position: 'absolute', right: 10, top: 10, width: 36, height: 36, backgroundColor: '#17382FCC', alignItems: 'center', justifyContent: 'center' },
  primaryButton: { minHeight: 48, backgroundColor: colors.ink, marginTop: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryLabel: { color: colors.white, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
  privacyNote: { color: colors.coralPale, fontSize: 10, marginTop: 9, textAlign: 'center' },
  messageBox: { marginTop: 12, padding: 11, backgroundColor: colors.coralPale },
  messageText: { color: colors.danger, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  messageDetail: { color: colors.inkSoft, fontSize: 11, marginTop: 4 },
  resultCard: { marginTop: 12, padding: 10, borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.leaf, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  resultImage: { width: 60, height: 60 },
  unknownResult: { width: 60, height: 60, backgroundColor: colors.leafDeep, alignItems: 'center', justifyContent: 'center' },
  resultCopy: { flex: 1, minWidth: 0 },
  unknownMark: { color: colors.ink, fontFamily: 'Georgia', fontSize: 31 },
  resultKicker: { color: colors.inkSoft, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  resultName: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: 3 },
  resultRarity: { color: colors.inkSoft, fontSize: 10, marginTop: 3 },
  resultScientific: { color: colors.inkSoft, fontSize: 11, fontStyle: 'italic', marginTop: 3 },
  resultFooter: { width: '100%', borderTopWidth: 1, borderTopColor: colors.leafDeep, paddingTop: 8 },
  resultDescription: { color: colors.ink, fontSize: 11, lineHeight: 15 },
  resultLink: { minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  resultLinkText: { color: colors.ink, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  featureHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 11 },
  featureCard: { height: 226, overflow: 'hidden', backgroundColor: colors.ink },
  featureImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  featureShade: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#0C251D55' },
  featureMeta: { position: 'absolute', left: 15, right: 15, bottom: 14 },
  featureEyebrow: { color: '#E8C763', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  featureName: { color: colors.white, fontFamily: 'Georgia', fontSize: 22, lineHeight: 26, marginTop: 5 },
  featureScientific: { color: '#FFFFFFD9', fontSize: 12, fontStyle: 'italic', marginTop: 3 },
  photoCredit: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 7 },
});