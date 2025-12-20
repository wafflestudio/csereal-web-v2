import { BASE_URL } from '~/constants/api';
import type { AdmissionsResponse } from '~/types/api/admissions';

type MainType = 'undergraduate' | 'graduate' | 'international';
type PostType =
  | 'early-admission'
  | 'regular-admission'
  | 'exchange-visiting'
  | 'graduate'
  | 'scholarships'
  | 'undergraduate';

export async function fetchAdmissions(
  mainType: MainType,
  postType: PostType,
): Promise<AdmissionsResponse> {
  const response = await fetch(
    `${BASE_URL}/v2/admissions/${mainType}/${postType}`,
  );
  if (!response.ok) throw new Error('Failed to fetch admissions');
  return (await response.json()) as AdmissionsResponse;
}
