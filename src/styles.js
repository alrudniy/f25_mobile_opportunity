import { StyleSheet } from 'react-native';

export const palette = {
  bg: '#f7f7fb',
  text: '#111',
  muted: '#64748b',
  border: '#e5e7eb',
  link: '#2563eb',
  btn: '#111827',
  btnPrimary: '#2563eb',
  cardBg: '#fff',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg, padding: 16 },
  headerSpace: { height: 8 },
  card: {
    backgroundColor: palette.cardBg,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 16
  },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: palette.text },
  p: { color: palette.muted, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  btn: {
    backgroundColor: palette.btn,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10
  },
  btnPrimary: { backgroundColor: palette.btnPrimary },
  btnText: { color: 'white', fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, color: palette.text
  },
  label: { color: palette.text, fontWeight: '600' },
  error: { color: '#b91c1c', marginTop: 6 },
  link: { color: palette.link, fontWeight: '600' },
  divider: { height: 12 },
  radioRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  radio: {
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, borderColor: palette.border
  },
  radioSelected: {
    backgroundColor: '#eef2ff', borderColor: palette.link
  }
});
