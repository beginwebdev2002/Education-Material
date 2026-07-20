import { schema, required } from '@angular/forms/signals';
import { AdType } from '@shared/models';

export interface AdvertisingForm {
    title: string;
    type: AdType;
    content: string;
    isActive: boolean;
}

export const initialAdvertisingForm: AdvertisingForm = {
    title: '',
    type: 'text',
    content: '',
    isActive: false,
};

export const advertisingFormSchema = schema<AdvertisingForm>((path) => {
    required(path.title, { message: 'This is a required field.' });
    required(path.content, { message: 'This is a required field.' });
});
