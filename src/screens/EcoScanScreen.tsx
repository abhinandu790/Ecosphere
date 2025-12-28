import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as DocumentPicker from 'expo-document-picker';
import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEcoSphereStore } from '@/state/store';
import { uploadApi } from '@/api/client';

const productHints: Record<string, { title: string; packaging: 'plastic' | 'paper' | 'glass' | 'metal' | 'mixed'; origin: 'local' | 'imported'; impact: string }>
  = {
    '8901030974217': { title: 'Organic lentils', packaging: 'paper', origin: 'local', impact: '0.9' },
    '021000658661': { title: 'Dark chocolate bar', packaging: 'paper', origin: 'imported', impact: '1.1' },
    '5601234567890': { title: 'Glass bottled kombucha', packaging: 'glass', origin: 'local', impact: '0.7' },
  };

export const EcoScanScreen: React.FC = () => {
  const addScanAction = useEcoSphereStore(state => state.addScanAction);
  const [title, setTitle] = useState('Organic pasta');
  const [barcode, setBarcode] = useState('');
  const [packaging, setPackaging] = useState<'plastic' | 'paper' | 'glass' | 'metal' | 'mixed'>('paper');
  const [origin, setOrigin] = useState<'local' | 'imported'>('local');
  const [impactKg, setImpactKg] = useState('1.2');
  const [expiryPredictionDays, setExpiryPredictionDays] = useState('5');
  const [receiptLink, setReceiptLink] = useState('');
  const [receiptSnippet, setReceiptSnippet] = useState('');
  const [receiptVerified, setReceiptVerified] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [productHint, setProductHint] = useState('');
  const [scanMessage, setScanMessage] = useState('Align the barcode/QR within the frame');

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then((permission: { status: string }) => {
      const granted = permission.status === 'granted';
      setHasPermission(granted);
      setScannerActive(granted);
    });
  }, []);

  const onBarCodeScanned = ({ data }: { data: string }) => {
    setBarcode(data);
    setScannedOnce(true);
    setScanMessage(`Captured code: ${data.substring(0, 24)}${data.length > 24 ? '…' : ''}`);
    setScannerActive(false);
    const directHint = productHints[data];
    const prefixHint =
      directHint || Object.entries(productHints).find(([key]) => data.startsWith(key.slice(0, 4)))?.[1];
    if (prefixHint) {
      setTitle(prefixHint.title);
      setPackaging(prefixHint.packaging);
      setOrigin(prefixHint.origin);
      setImpactKg(prefixHint.impact);
      setProductHint(prefixHint.title);
    }
  };

  const handleScan = () => {
    addScanAction({
      title,
      barcode: barcode || undefined,
      packaging,
      origin,
      receiptUrl: receiptLink || undefined,
      receiptSnippet: receiptSnippet || undefined,
      receiptVerified: receiptVerified ?? undefined,
      productHint: productHint || undefined,
      impactKg: parseFloat(impactKg) || 0,
      expiryPredictionDays: parseInt(expiryPredictionDays, 10) || 0
    });
    setTitle('');
    setBarcode('');
    setProductHint('');
    setReceiptSnippet('');
  };

  const handlePickReceipt = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.length) return;
    const file = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadApi.receipt({ uri: file.uri, name: file.name || 'receipt', type: file.mimeType || 'application/octet-stream' });
      setReceiptLink(uploaded.url || uploaded.key);
      if (uploaded.text_snippet) {
        setReceiptSnippet(uploaded.text_snippet);
        setReceiptVerified(Boolean(uploaded.verified));
        setScanMessage(uploaded.verified ? 'Total verified from receipt' : 'Receipt parsed — please confirm values');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroTitle}>EcoScan</Text>
            <Text style={styles.heroSubtitle}>Barcode capture, bill verification, and expiry intelligence.</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{receiptVerified ? 'Bill verified' : 'Ready to scan'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Live barcode scanner</Text>
            <Text style={styles.sectionCaption}>{scanMessage}</Text>
          </View>
          <View style={styles.scannerContainer}>
            {hasPermission === false && <Text style={styles.warning}>Camera permission is required to scan barcodes.</Text>}
            {hasPermission && scannerActive && (
              <>
                <BarCodeScanner onBarCodeScanned={onBarCodeScanned} style={[styles.scanner, StyleSheet.absoluteFillObject]} />
                <View style={styles.overlay}>
                  <View style={styles.crosshair} />
                </View>
              </>
            )}
            {!scannerActive && (
              <Pressable style={styles.scannerFallback} onPress={() => setScannerActive(true)}>
                <Text style={styles.scannerCTA}>{scannedOnce ? 'Scan again' : 'Start scanning'}</Text>
                <Text style={styles.sectionCaption}>Tap to capture barcode / QR</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.scanMetaRow}>
            <View style={styles.scanMetaChip}>
              <Text style={styles.metaLabel}>Barcode</Text>
              <Text style={styles.metaValue}>{barcode || 'Awaiting capture'}</Text>
            </View>
            <View style={styles.scanMetaChip}>
              <Text style={styles.metaLabel}>Product hint</Text>
              <Text style={styles.metaValue}>{productHint || 'Auto-detects when known'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product + impact details</Text>
          <TextInput
            style={styles.input}
            placeholder="Product or item title"
            placeholderTextColor="#cbd5e1"
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.dualRow}>
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Impact kg"
              placeholderTextColor="#cbd5e1"
              value={impactKg}
              onChangeText={setImpactKg}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Expiry prediction (days)"
              placeholderTextColor="#cbd5e1"
              value={expiryPredictionDays}
              onChangeText={setExpiryPredictionDays}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.label}>Packaging type</Text>
          <View style={styles.chipRow}>
            {['plastic', 'paper', 'glass', 'metal', 'mixed'].map(option => (
              <Pressable key={option} style={[styles.chip, packaging === option && styles.chipActive]} onPress={() => setPackaging(option as any)}>
                <Text style={styles.chipText}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Origin</Text>
          <View style={styles.chipRow}>
            {['local', 'imported'].map(option => (
              <Pressable key={option} style={[styles.chip, origin === option && styles.chipActive]} onPress={() => setOrigin(option as any)}>
                <Text style={styles.chipText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Receipt + bill verification</Text>
            <Text style={styles.sectionCaption}>Uploads go to Cloudflare R2 with OCR text highlights.</Text>
          </View>
          <View style={styles.uploadRow}>
            <Button title={uploading ? 'Uploading…' : 'Attach receipt'} onPress={handlePickReceipt} disabled={uploading} />
            {receiptLink ? <Text style={styles.receiptText}>{receiptVerified ? 'Verified total' : 'Uploaded'}</Text> : null}
          </View>
          {receiptSnippet ? (
            <View style={styles.receiptPreview}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Receipt text</Text>
                <Text style={[styles.badgeTag, receiptVerified ? styles.tagGood : styles.tagWarn]}>
                  {receiptVerified ? 'Matched total' : 'Needs confirmation'}
                </Text>
              </View>
              <Text style={styles.previewBody}>{receiptSnippet}</Text>
              <Text style={[styles.previewStatus, receiptVerified ? styles.statusGood : styles.statusWarn]}>
                {receiptVerified ? 'We detected a total line in this bill.' : 'No obvious total found — double-check the amount.'}
              </Text>
            </View>
          ) : (
            <Text style={styles.sectionCaption}>Attach a bill to auto-parse totals and tie it to your EcoCart.</Text>
          )}
        </View>

        <Pressable style={styles.cta} onPress={handleScan}>
          <Text style={styles.ctaText}>Add to EcoCart with verification</Text>
          <Text style={styles.ctaSub}>Stores barcode, parsed receipt text, and expiry prediction</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 24 },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: { color: '#e2e8f0', fontSize: 24, fontWeight: '800' },
  heroSubtitle: { color: '#94a3b8', marginTop: 4, maxWidth: '80%' },
  heroPill: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  heroPillText: { color: '#0b1224', fontWeight: '800' },
  card: {
    backgroundColor: '#0b1224',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardHeader: { marginBottom: 10 },
  sectionTitle: { color: '#e2e8f0', fontWeight: '800', fontSize: 16 },
  sectionCaption: { color: '#94a3b8', marginTop: 2 },
  scannerContainer: {
    height: 220,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0b1224',
    borderWidth: 1,
    borderColor: '#1f2a44',
    justifyContent: 'center',
  },
  scanner: { height: '100%', width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1d4ed8',
  },
  crosshair: {
    width: 160,
    height: 120,
    borderWidth: 2,
    borderColor: '#22d3ee',
    borderRadius: 12,
  },
  scannerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  scannerCTA: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  scanMetaRow: { flexDirection: 'row', gap: 10 },
  scanMetaChip: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  metaLabel: { color: '#94a3b8', fontSize: 12 },
  metaValue: { color: '#e2e8f0', fontWeight: '700', marginTop: 2 },
  label: { color: '#e2e8f0', marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  dualRow: { flexDirection: 'row', gap: 10 },
  inlineInput: { flex: 1 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1f2a44' },
  chipActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  chipText: { color: '#e2e8f0', textTransform: 'capitalize' },
  warning: { color: '#fbbf24', marginBottom: 8 },
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  receiptText: { color: '#22d3ee', fontWeight: '700' },
  receiptPreview: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#1f2a44' },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  previewTitle: { color: '#e2e8f0', fontWeight: '700' },
  previewBody: { color: '#cbd5e1', marginBottom: 6 },
  badgeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '800',
  },
  tagGood: { backgroundColor: '#22c55e33', color: '#22c55e' },
  tagWarn: { backgroundColor: '#f9731633', color: '#f97316' },
  previewStatus: { fontWeight: '700' },
  statusGood: { color: '#22c55e' },
  statusWarn: { color: '#f97316' },
  cta: {
    backgroundColor: '#22d3ee',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  ctaText: { color: '#0b1224', fontWeight: '800', fontSize: 16 },
  ctaSub: { color: '#0b1224', marginTop: 2, fontWeight: '600' },
});

export default EcoScanScreen;
