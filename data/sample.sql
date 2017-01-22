CREATE TABLE customers (
  id int(10) UNSIGNED NOT NULL,
  email varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  name varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO customers (id, email, name) VALUES
(1, 'jaina.proudmoore@hearthstone.com', 'Jaina Proudmoore'),
(2, 'malfurion.stormrage@hearthstone.com', 'Malfurion Stormrage');

CREATE TABLE orders (
  id int(10) UNSIGNED NOT NULL,
  created datetime DEFAULT NULL,
  customerId int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO orders (id, created, customerId) VALUES
(1, '2017-01-20 07:10:14', 1),
(2, '2017-01-18 05:36:09', 1),
(3, '2017-01-10 17:40:12', 2);

CREATE TABLE orders_products (
  orderId int(10) UNSIGNED NOT NULL,
  productId int(10) UNSIGNED NOT NULL,
  amount int(10) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO orders_products (orderId, productId, amount) VALUES
(1, 1, 1),
(1, 3, 2),
(2, 4, 8),
(3, 2, 1);

CREATE TABLE products (
  id int(10) UNSIGNED NOT NULL,
  name varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  cost int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (id, name, cost) VALUES
(1, 'Broadsword', 700),
(2, 'Round Shield', 1200),
(3, 'Longbow', 550),
(4, 'Leather Scraps', 75);


ALTER TABLE customers
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email);

ALTER TABLE orders
  ADD PRIMARY KEY (id),
  ADD KEY customerId (customerId);

ALTER TABLE orders_products
  ADD PRIMARY KEY (orderId,productId),
  ADD KEY productId (productId);

ALTER TABLE products
  ADD PRIMARY KEY (id);


ALTER TABLE customers
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE orders
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE products
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE orders
  ADD CONSTRAINT orders_ibfk_1 FOREIGN KEY (customerId) REFERENCES customers (id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE orders_products
  ADD CONSTRAINT orders_products_ibfk_1 FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT orders_products_ibfk_2 FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE;