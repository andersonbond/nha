# Updates Summary (Feb 25, 2026)

## 1. API fallback when server is off

- **File:** `frontend/app/lib/api.ts`
- **Change:** The app first calls the real API; if the request fails (e.g. server down, network error), it falls back to the mock layer.
- **Result:** With the server off, Application, Beneficiaries, Projects, and Programs no longer show "Failed to fetch"; they use mock data instead.

---

## 2. Frontend env for mock mode

- **File:** `frontend/.env` (new)
- **Change:** Added `NEXT_PUBLIC_USE_MOCK_DATA=true` in `frontend/.env` because Next.js only loads `.env` from the app directory (frontend), not the repo root.
- **Result:** Mock mode is correctly applied when running the frontend from `frontend/`.

---

## 3. Application form – dropdowns

- **File:** `frontend/components/applications/ApplicationFormSlideOver.tsx`
- **Changes:**
  - **Tenurial code** → dropdown (e.g. CLOA, CLEA, Residential, Agricultural, Commercial, Other)
  - **Indicator** → dropdown (New, Renewal, Transfer, Conversion, Other)
  - **Sex** → dropdown (Male, Female), with "M"/"F" shown as Male/Female
  - **Civil status** → dropdown (Single, Married, Widowed, Separated, Divorced, Legally Separated, Annulled, Common Law)
  - **Valid ID type** → dropdown (National ID, Voters ID, Driver's License, Passport)

---

## 4. Beneficiary form – Sex and Civil status

- **File:** `frontend/components/beneficiaries/BeneficiaryFormSlideOver.tsx`
- **Change:** Same Sex (Male/Female) and Civil status dropdowns as on the Application form, with the same options and M/F normalization.
- **Result:** Application and Beneficiary forms are aligned for sex and civil status.

---

## 5. Field icons on Application and Beneficiary forms

- **Files:** `ApplicationFormSlideOver.tsx`, `BeneficiaryFormSlideOver.tsx`
- **Change:** Each field label on both add/edit slide-overs now has a small Heroicons outline icon (e.g. document, user, calendar, map pin, tag) to the left of the label, using a shared muted style.
- **Result:** Clearer, more consistent form layout on both modules.

---

## Files touched

- `frontend/app/lib/api.ts`
- `frontend/.env`
- `frontend/components/applications/ApplicationFormSlideOver.tsx`
- `frontend/components/beneficiaries/BeneficiaryFormSlideOver.tsx`
