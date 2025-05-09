[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Country Scope

A React-based frontend application that integrates the REST Countries API to display country information, allowing users to search, filter, and favorite countries. Built with Vite, Tailwind CSS, and Firebase for user authentication and favorite management.

## Features
- View a list of countries with details (name, capital, region, population, flag, languages).
- Search countries by name.
- Filter countries by region or language.
- View detailed country information on a dedicated page with a Google Map.
- User authentication (email/password and Google) with session management.
- Favorite countries (requires login).
- Light/dark modes.
- Responsive design for mobile, tablet, and desktop.
- Unit and integration tests using Jest and React Testing Library.

## Technology Stack
- **Frontend**: React (functional components), Vite
- **Language**: JavaScript
- **CSS Framework**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore for favorites)
- **API**: REST Countries API
- **Testing**: Jest, React Testing Library
- **Hosting**: Vercel - https://country-scope-plum.vercel.app/
- **Version Control**: Git, GitHub

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/country-scope.git
   cd country-scope

## In order to run the Application

1. **Change directory to countries-client**:
   ```bash
   cd countries-client 

3. **install dependencies**:
   ```bash
   npm install

4. **Configure environment variables: create a .env file in the root directory**: 
   ```bash
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

## Running the Application 

1. **Run the Application**:
   ```bash
   npm run dev

2. **Build for Production**:
   ```bash
   npm run build

3. **Run Tests**:
   ```bash
   npm test

## Features

- **Home Page**  
  Browse all countries, search by name, or filter by region/language.

- **Country Details**  
  Click a country card to view detailed information and an embedded map.

- **Favorites**  
  Log in to save favorite countries (accessible via the "My Favorites" link).

- **Theme Toggle**  
  Switch between light and dark themes using the button in the navbar.

- **Authentication**  
  Log in or register using email/password or Google authentication.

---

## API Usage

This application uses the [REST Countries API](https://restcountries.com/):

- `GET /all` – Fetches all countries  
- `GET /name/{name}` – Searches for a country by name  
- `GET /region/{region}` – Filters countries by region  
- `GET /alpha/{code}` – Retrieves detailed country data by code  

---

## Hosting

The application is deployed at:  
**https://country-scope-plum.vercel.app/**  

---

## Testing

- **Unit Tests**
  - Components tested:
    - `CountryCard`
    - `SearchBar`
    - `RegionFilter`
    - `LanguageFilter`

- **Integration Tests**
  - Verifies filtering and rendering on the Home page.

- **Responsiveness**
  - Tested on mobile, tablet, and desktop using browser developer tools.

- **Cross-Browser Compatibility**
  - Verified on Chrome, Firefox, and Safari.

---



   
 
