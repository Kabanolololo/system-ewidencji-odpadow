INSERT INTO drivers (name, surname, created_at, edited_at) VALUES
('Jan', 'Kowalski', NOW(), NOW()),
('Anna', 'Nowak', NOW(), NOW()),
('Piotr', 'Wiśniewski', NOW(), NOW()),
('Katarzyna', 'Wójcik', NOW(), NOW()),
('Marek', 'Kaczmarek', NOW(), NOW()),
('Ewa', 'Zielińska', NOW(), NOW()),
('Tomasz', 'Szymański', NOW(), NOW()),
('Magdalena', 'Lewandowska', NOW(), NOW()),
('Paweł', 'Dąbrowski', NOW(), NOW()),
('Monika', 'Krawczyk', NOW(), NOW());

INSERT INTO vehicles (registration_number, brand, model, created_at, edited_at) VALUES
('KR12345', 'Toyota', 'Corolla', NOW(), NOW()),
('WA98765', 'Ford', 'Focus', NOW(), NOW()),
('PO45678', 'Volkswagen', 'Golf', NOW(), NOW()),
('GD23456', 'Honda', 'Civic', NOW(), NOW()),
('LU34567', 'BMW', '320i', NOW(), NOW()),
('PL76543', 'Audi', 'A4', NOW(), NOW()),
('BZ65432', 'Mercedes', 'C200', NOW(), NOW()),
('RA54321', 'Opel', 'Astra', NOW(), NOW()),
('LU87654', 'Skoda', 'Octavia', NOW(), NOW()),
('KR43210', 'Mazda', '3', NOW(), NOW());

INSERT INTO wastes (code, name, notes, created_at, edited_at) VALUES
('150101', 'Papier i tektura', 'Odpady papierowe i tekturowe, np. kartony', NOW(), NOW()),
('150102', 'Tworzywa sztuczne', 'Odpady plastikowe, folie', NOW(), NOW()),
('150103', 'Metale', 'Odpady metalowe, złom', NOW(), NOW()),
('150104', 'Szkło', 'Odpady szklane, butelki', NOW(), NOW()),
('150105', 'Drewno', 'Odpady drewniane', NOW(), NOW()),
('150106', 'Tekstylia', 'Odpady tekstylne, tkaniny', NOW(), NOW()),
('150107', 'Odpady niebezpieczne', 'Materiały zawierające substancje niebezpieczne', NOW(), NOW()),
('150108', 'Mieszane odpady komunalne', 'Odpady komunalne różnego rodzaju', NOW(), NOW()),
('150109', 'Zużyte baterie i akumulatory', 'Baterie i akumulatory do utylizacji', NOW(), NOW()),
('150110', 'Oleje i tłuszcze', 'Zużyte oleje silnikowe i tłuszcze', NOW(), NOW());

INSERT INTO destinations (country, voivodeship, city, postal_code, address, created_at, edited_at) VALUES
('Poland', 'Mazowieckie', 'Warsaw', '00-001', 'Aleje Jerozolimskie 123', NOW(), NOW()),
('Poland', 'Małopolskie', 'Kraków', '30-002', 'ul. Floriańska 10', NOW(), NOW()),
('Poland', 'Dolnośląskie', 'Wrocław', '50-003', 'ul. Piłsudskiego 45', NOW(), NOW()),
('Poland', 'Pomorskie', 'Gdańsk', '80-004', 'ul. Długa 20', NOW(), NOW()),
('Poland', 'Śląskie', 'Katowice', '40-005', 'ul. Mariacka 7', NOW(), NOW()),
('Poland', 'Wielkopolskie', 'Poznań', '60-006', 'ul. Główna 3', NOW(), NOW()),
('Poland', 'Łódzkie', 'Łódź', '90-007', 'ul. Piotrkowska 100', NOW(), NOW()),
('Poland', 'Lubelskie', 'Lublin', '20-008', 'ul. Krakowskie Przedmieście 5', NOW(), NOW()),
('Poland', 'Podlaskie', 'Białystok', '15-009', 'ul. Lipowa 2', NOW(), NOW()),
('Poland', 'Zachodniopomorskie', 'Szczecin', '70-010', 'ul. Wojska Polskiego 55', NOW(), NOW());

INSERT INTO contractors (nip, regon, name, address, created_at, edited_at) VALUES
('1234567890', '123456789', 'Example Company Sp. z o.o.', 'ul. Przykładowa 1, 00-000 Warszawa', NOW(), NOW()),
('9876543210', '987654321', 'Tech Solutions S.A.', 'ul. Technologiczna 5, 01-234 Kraków', NOW(), NOW()),
('4567891230', '456789123', 'Budowa i Remonty Sp. z o.o.', 'ul. Budowlana 12, 02-345 Poznań', NOW(), NOW()),
('6543219870', '654321987', 'Transport Polska Sp. z o.o.', 'ul. Transportowa 8, 03-456 Gdańsk', NOW(), NOW()),
('3216549870', '321654987', 'Handel Detaliczny S.A.', 'ul. Handlowa 3, 04-567 Wrocław', NOW(), NOW()),
('7891234560', '789123456', 'Produkcja Mebli Sp. z o.o.', 'ul. Meblowa 10, 05-678 Lublin', NOW(), NOW()),
('1472583690', '147258369', 'Usługi Informatyczne Sp. z o.o.', 'ul. Informatyczna 15, 06-789 Białystok', NOW(), NOW()),
('9638527410', '963852741', 'Firma Sprzątająca Sp. z o.o.', 'ul. Czysta 20, 07-890 Rzeszów', NOW(), NOW()),
('8527419630', '852741963', 'Ogrodnictwo Polska S.A.', 'ul. Zielona 25, 08-901 Opole', NOW(), NOW()),
('7419638520', '741963852', 'Firma Kurierska Sp. z o.o.', 'ul. Kurierska 30, 09-012 Katowice', NOW(), NOW());

INSERT INTO waste_records (contractor_id, user_id, waste_id, vehicle_id, driver_id, destination_id, transfer_date, mass_kg, price_per_kg, total_price, notes, created_at, edited_at) VALUES
(1, 1, 3, 4, 5, 6, '2024-01-15', 250.0, 2.5, 625.0, 'First batch', NOW(), NOW()),
(2, 1, 4, 5, 6, 7, '2024-02-10', 500.0, 1.8, 900.0, NULL, NOW(), NOW()),
(3, 1, 5, 6, 7, 8, '2024-03-05', 750.0, 3.0, 2250.0, 'Urgent transport', NOW(), NOW()),
(4, 1, 6, 7, 8, 9, '2024-04-20', 300.0, 2.0, 600.0, 'Special conditions', NOW(), NOW()),
(5, 1, 7, 8, 9, 10, '2024-05-12', 450.0, 4.0, 1800.0, NULL, NOW(), NOW()),
(6, 1, 8, 9, 10, 1, '2024-06-18', 600.0, 1.5, 900.0, 'Late arrival', NOW(), NOW()),
(7, 1, 9, 10, 1, 2, '2024-07-25', 850.0, 2.2, 1870.0, NULL, NOW(), NOW()),
(8, 1, 10, 1, 2, 3, '2024-08-30', 200.0, 3.5, 700.0, 'Requires inspection', NOW(), NOW()),
(9, 1, 1, 2, 3, 4, '2024-09-14', 950.0, 1.2, 1140.0, NULL, NOW(), NOW()),
(10, 1, 2, 3, 4, 5, '2024-10-09', 400.0, 4.5, 1800.0, 'Handle with care', NOW(), NOW()),
(1, 1, 5, 7, 9, 2, '2024-11-02', 520.0, 2.7, 1404.0, NULL, NOW(), NOW()),
(2, 1, 6, 8, 10, 3, '2024-11-15', 670.0, 3.1, 2077.0, 'Hazardous waste', NOW(), NOW()),
(3, 1, 7, 9, 1, 4, '2024-11-28', 330.0, 1.9, 627.0, NULL, NOW(), NOW()),
(4, 1, 8, 10, 2, 5, '2024-12-05', 580.0, 2.4, 1392.0, NULL, NOW(), NOW()),
(5, 1, 9, 1, 3, 6, '2024-12-19', 430.0, 3.8, 1634.0, 'Night shift', NOW(), NOW()),
(6, 1, 10, 2, 4, 7, '2024-12-22', 310.0, 2.6, 806.0, NULL, NOW(), NOW()),
(7, 1, 1, 3, 5, 8, '2024-12-27', 720.0, 1.7, 1224.0, NULL, NOW(), NOW()),
(8, 1, 2, 4, 6, 9, '2024-12-29', 820.0, 2.1, 1722.0, 'Extra security', NOW(), NOW()),
(9, 1, 3, 5, 7, 10, '2024-12-30', 270.0, 4.2, 1134.0, NULL, NOW(), NOW()),
(10, 1, 4, 6, 8, 1, '2024-12-31', 650.0, 3.3, 2145.0, 'End of year shipment', NOW(), NOW());

