import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react-native';
import type { Bird } from '../data/birds';
import { colors, rarityColors } from '../theme';

type Props = {
  bird: Bird;
  photoUri: string | null;
  saved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
};

export function BirdRow({ bird, photoUri, saved, onOpen, onToggleSaved }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${bird.name}`}
        onPress={onOpen}
        style={styles.main}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <View style={styles.unknownImage}><Text style={styles.question}>?</Text></View>
        )}
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.name}>{bird.name}</Text>
          <Text numberOfLines={1} style={styles.scientific}>{bird.scientificName}</Text>
          <View style={styles.meta}>
            <View style={[styles.dot, { backgroundColor: rarityColors[bird.rarity] }]} />
            <Text style={styles.rarity}>{bird.rarity}</Text>
          </View>
        </View>
        <ChevronRight color={colors.muted} size={18} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? `Remove ${bird.name} from Pokedex` : `Add ${bird.name} to Pokedex`}
        onPress={onToggleSaved}
        hitSlop={8}
        style={styles.saveButton}
      >
        {saved ? <BookmarkCheck color={colors.ink} size={20} /> : <Bookmark color={colors.inkSoft} size={20} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, borderWidth: 1, borderColor: colors.line, marginBottom: 10, padding: 10, minHeight: 104 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  image: { width: 78, height: 80, borderRadius: 6, backgroundColor: colors.leaf },
  unknownImage: { width: 78, height: 80, borderRadius: 6, backgroundColor: colors.leaf, alignItems: 'center', justifyContent: 'center' },
  question: { color: colors.ink, fontFamily: 'Georgia', fontSize: 39, lineHeight: 45 },
  copy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  name: { color: colors.ink, fontSize: 15, fontWeight: '700', lineHeight: 19 },
  scientific: { color: colors.muted, fontSize: 12, fontStyle: 'italic', marginTop: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  rarity: { color: colors.inkSoft, fontSize: 11, textTransform: 'capitalize' },
  saveButton: { width: 38, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
});