// app/log/cycle.tsx
import { GlobalLogger } from '@/utils/eventLogger';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, Pressable, TextInput, View } from 'react-native';

import { H1, Muted, Strong } from '@/components/ui/typography';

/**
 * CycleLogScreen
 * Logs either “period started” or “period ended” for a selected date.
 */

// toISODate: Formats a Date as YYYY-MM-DD for display and web inputs.
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// fromISODate: Parses YYYY-MM-DD into a local Date at midnight 
function fromISODate(value: string) {
  const [y, m, day] = value.split('-').map(Number);
  if (!y || !m || !day) return null;
  const d = new Date(y, m - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CycleLogScreen() {
  const router = useRouter();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [type, setType] = useState<'period_start' | 'period_end'>('period_start');
  const [isSaving, setIsSaving] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(date);

  const dateValue = useMemo(() => toISODate(date), [date]);

  // openPicker: Opens the date picker modal and seeds it with the current date value.
  const openPicker = () => {
    setTempDate(date);
    setShowPicker(true);
  };

  // closePicker: Closes the date picker modal without applying changes.
  const closePicker = () => setShowPicker(false);

  // confirmPicker: Applies the temporary date and closes the date picker modal.
  const confirmPicker = () => {
    setDate(tempDate);
    setShowPicker(false);
  };

  // handleSave: Writes the cycle event to the database and returns to the previous screen.
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Store as UTC noon to avoid timezone "day shift" issues on different devices.
      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate();
      const stable = new Date(Date.UTC(y, m, d, 12, 0, 0));

      await GlobalLogger.cycle(type, stable);
      setTimeout(() => router.back(), 300);
    } catch (error) {
      Alert.alert('Error', 'Database connection failed. Is your internet on?');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-ui-bg">
      <View className="px-6" style={{ paddingTop: 64 }}>
        <H1 className="text-ui-text text-2xl">Cycle Tracking</H1>
        <Muted className="text-ui-muted mt-2">
          Logging start/end dates helps the dashboard calculate cycle day and phase more accurately.
        </Muted>

        {/* Type toggle */}
        <View className="flex-row mt-6 bg-ui-surface p-1 rounded-2xl border border-ui-border">
          <Pressable
            onPress={() => setType('period_start')}
            className={`flex-1 py-4 rounded-xl items-center ${
              type === 'period_start' ? 'bg-ui-primary' : ''
            }`}
          >
            <Strong className={type === 'period_start' ? 'text-white' : 'text-ui-text'}>
              Period Started
            </Strong>
          </Pressable>

          <Pressable
            onPress={() => setType('period_end')}
            className={`flex-1 py-4 rounded-xl items-center ${
              type === 'period_end' ? 'bg-ui-primary' : ''
            }`}
          >
            <Strong className={type === 'period_end' ? 'text-white' : 'text-ui-text'}>
              Period Ended
            </Strong>
          </Pressable>
        </View>

        {/* Date selector */}
        <View className="bg-ui-surface p-6 rounded-3xl border border-ui-border mt-6">
          <Strong className="text-ui-text text-center">When did this happen?</Strong>

          <Pressable onPress={openPicker} className="bg-ui-bg p-4 rounded-2xl border border-ui-border mt-4">
            <Strong className="text-ui-text">{dateValue}</Strong>
            <Muted className="text-ui-muted text-xs mt-1">Tap to select date</Muted>
          </Pressable>
        </View>
      </View>

      {/* Picker modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={closePicker}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View className="bg-ui-surface rounded-t-3xl p-5 border border-ui-border">
            <View className="flex-row justify-between items-center mb-3">
              <Pressable onPress={closePicker} className="px-3 py-2">
                <Strong className="text-ui-text">Cancel</Strong>
              </Pressable>

              <Strong className="text-ui-text">Select Date</Strong>

              <Pressable onPress={confirmPicker} className="px-3 py-2">
                <Strong className="text-ui-secondary">Done</Strong>
              </Pressable>
            </View>

            {Platform.OS === 'web' ? (
              <View>
                <Muted className="text-ui-muted mb-2">Pick a date</Muted>
                <TextInput
                  value={toISODate(tempDate)}
                  onChangeText={(v) => {
                    const parsed = fromISODate(v);
                    if (parsed) setTempDate(parsed);
                  }}
                  // @ts-ignore web-only input prop
                  type="date"
                  className="bg-ui-bg p-4 rounded-2xl border border-ui-border text-ui-text"
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_e, d) => d && setTempDate(d)}
                maximumDate={new Date()}
                themeVariant="light"
                style={{ width: '100%' }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom actions */}
      <View className="mt-auto px-6 pb-10">
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className={`py-5 rounded-2xl items-center mb-4 border ${
            isSaving ? 'bg-ui-border border-ui-border' : 'bg-ui-primary border-ui-primary'
          }`}
        >
          {isSaving ? <ActivityIndicator color="white" /> : <Strong className="text-white text-lg">Confirm & Save</Strong>}
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="bg-ui-surface py-4 rounded-2xl items-center border border-ui-border"
        >
          <Strong className="text-ui-text text-lg">Cancel</Strong>
        </Pressable>
      </View>
    </View>
  );
}
