import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable } from "react-native";
import { TextInput } from "react-native-paper";

type Props = {
  value: string;
  labelProp: string;
  onChange: (time: string) => void;
};

export default function TimePicker({ value, onChange, labelProp }: Props) {
  const [show, setShow] = useState(false);

  const dateValue = value
    ? new Date(`2000-01-01 ${value}`)
    : new Date(`2000-01-01 00:00`);

  return (
    <>
      <Pressable onPress={() => setShow(true)}>
        <TextInput label={labelProp} value={value} editable={false} />
      </Pressable>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="time"
          is24Hour={false}
          onChange={(_, selected) => {
            setShow(false);
            if (!selected) return;

            const formatted = selected.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            onChange(formatted);
            // console.log(value, formatted);
          }}
        />
      )}
    </>
  );
}
