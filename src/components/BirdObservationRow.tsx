import { Image, StyleSheet, Text, View } from 'react-native';
import { BirdObservation } from '../services/collection';
import { colors } from '../theme';

type Props = {
  observation: BirdObservation;
};

export function BirdObservationRow({ observation }: Props) {
  const identified = Boolean(observation.commonName && observation.photoUri);
  const regionLabel = observation.regions.join(', ') || 'Range unknown';

  return (
    <View style={styles.row}>
      {identified ? (
        <Image source={{ uri: observation.photoUri! }} style={styles.image} />
      ) : (
        <View style={styles.unknownImage}><Text style={styles.question}>?</Text></View>
      )}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>{observation.commonName ?? 'Unidentified bird'}</Text>
        {observation.scientificName && <Text numberOfLines={1} style={styles.scientific}>{observation.scientificName}</Text>}
        <Text numberOfLines={1} style={styles.meta}>{regionLabel} · {new Date(observation.identifiedAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 94, flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.white },
  image: { width: 72, height: 72, borderRadius: 6, backgroundColor: colors.leaf },
  unknownImage: { width: 72, height: 72, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.leaf },
  question: { color: colors.ink, fontFamily: 'Georgia', fontSize: 39, lineHeight: 45 },
  copy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  name: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  scientific: { color: colors.muted, fontSize: 12, fontStyle: 'italic', marginTop: 3 },
  meta: { color: colors.muted, fontSize: 10, marginTop: 7 },
});