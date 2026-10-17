import { Image, StyleSheet, Text, View } from 'react-native';
import type { WorldBirdSpecies } from '../data/world-birds';
import { colors } from '../theme';

type Props = {
  species: WorldBirdSpecies;
  photoUri: string | null;
};

export function WorldBirdRow({ species, photoUri }: Props) {
  return (
    <View style={styles.row}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}><Text style={styles.question}>?</Text></View>
      )}
      <View style={styles.copy}>
        <Text numberOfLines={2} style={styles.name}>{species.name}</Text>
        <Text numberOfLines={1} style={styles.scientific}>{species.scientificName}</Text>
        <Text numberOfLines={1} style={styles.regions}>{species.regions.join(', ')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 96, flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.white },
  image: { width: 78, height: 80, borderRadius: 6, backgroundColor: colors.leaf },
  placeholder: { width: 78, height: 80, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.leaf },
  question: { color: colors.ink, fontFamily: 'Georgia', fontSize: 39, lineHeight: 45 },
  copy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  name: { color: colors.ink, fontSize: 15, fontWeight: '700', lineHeight: 19 },
  scientific: { color: colors.muted, fontSize: 12, fontStyle: 'italic', marginTop: 3 },
  regions: { color: colors.muted, fontSize: 10, marginTop: 7 },
});