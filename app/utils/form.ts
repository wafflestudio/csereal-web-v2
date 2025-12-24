import type { EditorFile, EditorImage } from '~/types/form';
import { isFalsy } from '~/types/utils';

export const getDeleteIds = ({
  prev,
  cur,
}: {
  prev: EditorFile[];
  cur: EditorFile[];
}) => {
  const prevIds = prev.flatMap((file) =>
    file.type === 'UPLOADED_FILE' ? [file.file.id] : [],
  );
  const curIds = cur.flatMap((file) =>
    file.type === 'UPLOADED_FILE' ? [file.file.id] : [],
  );

  return [...new Set(prevIds).difference(new Set(curIds))];
};

// TODO: 이름좀...
export class FormData2 extends FormData {
  appendJson<T>(key: string, value: T) {
    this.append(
      key,
      new Blob([JSON.stringify(value)], { type: 'application/json' }),
    );
  }
  appendIfLocal(key: string, value: EditorImage | EditorFile | EditorFile[]) {
    if (Array.isArray(value)) {
      value.forEach((file) => this.appendIfLocal(key, file));
      return;
    }
    if (isFalsy(value)) return;
    if (value.type === 'LOCAL_FILE') {
      this.append(key, value.file);
    }
    if (value.type === 'LOCAL_IMAGE') {
      this.append(key, value.file);
    }
  }
}
