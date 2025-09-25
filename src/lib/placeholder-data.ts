export const user = {
  name: 'Ahmed Al-Farsi',
  email: 'ahmed.alfarsi@example.com',
  avatar: 'https://picsum.photos/seed/avatar1/100/100',
};

export const pharmacies = [
  {
    id: '1',
    name: 'Al-Dawaa Pharmacy',
    nameAr: 'صيدلية الدواء',
    address: '123 King Fahd Road, Riyadh, KSA',
    addressAr: '123 طريق الملك فهد، الرياض، المملكة العربية السعودية',
    licenseNumber: 'SA-12345',
    contact: '920000828',
    logoUrl: 'https://picsum.photos/seed/pharma1/200/200',
  },
  {
    id: '2',
    name: 'Nahdi Pharmacy',
    nameAr: 'صيدلية النهدي',
    address: '456 Prince Sultan St, Jeddah, KSA',
    addressAr: '456 شارع الأمير سلطان، جدة، المملكة العربية السعودية',
    licenseNumber: 'SA-67890',
    contact: '920000932',
    logoUrl: 'https://picsum.photos/seed/pharma2/200/200',
  },
  {
    id: '3',
    name: 'Green Cross Pharmacy',
    nameAr: 'صيدلية الصليب الأخضر',
    address: '789 Olaya St, Dammam, KSA',
    addressAr: '789 شارع العليا، الدمام، المملكة العربية السعودية',
    licenseNumber: 'SA-54321',
    contact: '920001111',
    logoUrl: 'https://picsum.photos/seed/pharma3/200/200',
  },
];

export const products = [
  { id: 'prod-001', name: 'Panadol Extra', scientificName: 'Paracetamol, Caffeine', price: 15.50, imageUrl: 'https://picsum.photos/seed/product1/400/300', imageHint: "medicine pills" },
  { id: 'prod-002', name: 'Aspirin Protect 100mg', scientificName: 'Acetylsalicylic Acid', price: 25.00, imageUrl: 'https://picsum.photos/seed/product2/400/300', imageHint: "medicine bottle" },
  { id: 'prod-003', name: 'Redoxon Vitamin C', scientificName: 'Ascorbic Acid', price: 30.75, imageUrl: 'https://picsum.photos/seed/product3/400/300', imageHint: "vitamins" },
  { id: 'prod-004', name: 'Prospan Cough Syrup', scientificName: 'Ivy Leaf Extract', price: 22.00, imageUrl: 'https://picsum.photos/seed/product4/400/300', imageHint: "syrup medicine" },
  { id: 'prod-005', name: 'Amoxil 500mg', scientificName: 'Amoxicillin', price: 18.25, imageUrl: 'https://picsum.photos/seed/product5/400/300', imageHint: "capsules medicine" },
  { id: 'prod-006', name: 'Voltaren Emulgel', scientificName: 'Diclofenac', price: 45.50, imageUrl: 'https://picsum.photos/seed/product6/400/300', imageHint: "ointment tube" },
];

export const invoices = [
  { id: 'INV-001', pharmacyId: '1', date: '2023-10-26', amount: 1500.75, status: 'paid' },
  { id: 'INV-002', pharmacyId: '2', date: '2023-10-28', amount: 3250.00, status: 'pending' },
  { id: 'INV-003', pharmacyId: '1', date: '2023-09-15', amount: 850.50, status: 'overdue' },
  { id: 'INV-004', pharmacyId: '3', date: '2023-11-01', amount: 5500.00, status: 'paid' },
  { id: 'INV-005', pharmacyId: '2', date: '2023-11-05', amount: 120.00, status: 'pending' },
];

export const transactions = [
    { date: '2023-10-01', type: 'Opening Balance', invoice: '-', amount: 5000.00, balance: 5000.00 },
    { date: '2023-10-05', type: 'Invoice', invoice: 'INV-001', amount: 1500.75, balance: 6500.75 },
    { date: '2023-10-10', type: 'Payment', invoice: 'INV-001', amount: -1500.75, balance: 5000.00 },
    { date: '2023-10-15', type: 'Invoice', invoice: 'INV-003', amount: 850.50, balance: 5850.50 },
    { date: '2023-10-20', type: 'Credit Note', invoice: 'CN-001', amount: -200.00, balance: 5650.50 },
];
