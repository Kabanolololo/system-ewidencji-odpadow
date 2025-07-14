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