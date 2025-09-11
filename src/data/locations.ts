export const cityAreaData = {
  'Mumbai': [
    'Bandra', 'Andheri', 'Juhu', 'Powai', 'Colaba', 'Fort', 'Worli', 'Lower Parel',
    'Malad', 'Borivali', 'Thane', 'Navi Mumbai', 'Goregaon', 'Versova', 'Khar'
  ],
  'Delhi': [
    'Connaught Place', 'Khan Market', 'Karol Bagh', 'Lajpat Nagar', 'Saket',
    'Vasant Kunj', 'Dwarka', 'Rohini', 'Janakpuri', 'Rajouri Garden', 'Nehru Place',
    'Greater Kailash', 'Defence Colony', 'Hauz Khas', 'Chandni Chowk'
  ],
  'Bangalore': [
    'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'BTM Layout',
    'Jayanagar', 'Malleshwaram', 'Rajajinagar', 'HSR Layout', 'Marathahalli',
    'Sarjapur Road', 'Bannerghatta Road', 'MG Road', 'Brigade Road', 'Ulsoor'
  ],
  'Hyderabad': [
    'Kukatpally', 'Miyapur', 'Charminar', 'Banjara Hills', 'Jubilee Hills',
    'Secunderabad', 'Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur',
    'Begumpet', 'Ameerpet', 'Dilsukhnagar', 'LB Nagar', 'Uppal'
  ],
  'Chennai': [
    'T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR',
    'Mylapore', 'Nungambakkam', 'Egmore', 'Guindy', 'Tambaram',
    'Porur', 'Chrompet', 'Besant Nagar', 'Alwarpet'
  ],
  'Kolkata': [
    'Park Street', 'Salt Lake', 'New Town', 'Howrah', 'Ballygunge',
    'Gariahat', 'Esplanade', 'Shyambazar', 'Jadavpur', 'Tollygunge',
    'Rajarhat', 'Behala', 'Garia', 'Barasat', 'Dum Dum'
  ],
  'Pune': [
    'Koregaon Park', 'Baner', 'Wakad', 'Hinjewadi', 'Kothrud',
    'Deccan', 'Camp', 'Viman Nagar', 'Aundh', 'Pimpri Chinchwad',
    'Hadapsar', 'Magarpatta', 'Kalyani Nagar', 'Shivaji Nagar', 'Karve Nagar'
  ],
  'Ahmedabad': [
    'Satellite', 'Vastrapur', 'Bodakdev', 'Prahlad Nagar', 'Navrangpura',
    'CG Road', 'SG Highway', 'Maninagar', 'Ghatlodia', 'Bopal',
    'Thaltej', 'Ambawadi', 'Paldi', 'Ellis Bridge', 'Ashram Road'
  ],
  'Jaipur': [
    'C-Scheme', 'MI Road', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar',
    'Tonk Road', 'Ajmer Road', 'JLN Marg', 'Bani Park', 'Civil Lines',
    'Raja Park', 'Sodala', 'Jagatpura', 'Sanganer', 'Bagru'
  ],
  'Surat': [
    'Adajan', 'Vesu', 'Althan', 'Piplod', 'Citylight',
    'Ghod Dod Road', 'Ring Road', 'Udhna', 'Rander', 'Katargam',
    'Varachha', 'Nanpura', 'Athwa', 'Magdalla', 'Dumas'
  ],
  'Lucknow': [
    'Hazratganj', 'Gomti Nagar', 'Indira Nagar', 'Aliganj', 'Mahanagar',
    'Aminabad', 'Chowk', 'Alambagh', 'Rajajipuram', 'Vikas Nagar',
    'Jankipuram', 'Ashiyana', 'Kalyanpur', 'Chinhat', 'Faizabad Road'
  ],
  'Kanpur': [
    'Civil Lines', 'Mall Road', 'Swaroop Nagar', 'Kidwai Nagar', 'Govind Nagar',
    'Kalyanpur', 'Barra', 'Kakadeo', 'Panki', 'Shyam Nagar',
    'Harsh Nagar', 'Tilak Nagar', 'Arya Nagar', 'Nawabganj', 'Sisamau'
  ]
};

export const getCitiesArray = (): string[] => {
  return Object.keys(cityAreaData);
};

export const getAreasForCity = (city: string): string[] => {
  return cityAreaData[city as keyof typeof cityAreaData] || [];
};