/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import Table from './components/Table';

const SORT_BY = {
  id: 'ID',
  name: 'Product',
  category: 'Category',
  user: 'User',
};

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return { ...product, category, user };
});

const filtrProducts = (goods, params) => {
  const { selectedUser, query, selectCaregories, sortBy } = params;

  return goods
    .filter(product => {
      if (selectedUser === 0) {
        return true;
      }

      return product.user.id === selectedUser;
    })
    .filter(product => {
      const productName = product.name.toLowerCase();

      return productName.includes(query.toLowerCase());
    })
    .filter(product => {
      if (selectCaregories.length === 0) {
        return true;
      }

      return selectCaregories.includes(product.categoryId);
    })
    .sort((productsA, productB) => {
      if (sortBy === SORT_BY.name) {
        return productsA.name.localeCompare(productB.name);
      }

      if (sortBy === SORT_BY.category) {
        return productsA.category.title.localeCompare(productB.category.title);
      }

      if (sortBy === SORT_BY.user) {
        return productsA.user.name.localeCompare(productB.user.name);
      }

      if (sortBy === SORT_BY.id) {
        return productsA.id - productB.id;
      }

      return 0;
    });
};

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectCaregories, setSelectCaregories] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  const filtredProducts = filtrProducts(products, {
    selectedUser,
    query,
    selectCaregories,
    sortBy,
  });

  const handleResetAll = () => {
    setSelectedUser(0);
    setQuery('');
    setSelectCaregories([]);
    setSortBy(null);
  };

  const handleSelectedCategory = categoryId => {
    if (selectCaregories.includes(categoryId)) {
      setSelectCaregories(selectCaregories.filter(id => id !== categoryId));
    } else {
      setSelectCaregories([...selectCaregories, categoryId]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(0)}
                className={cn({ 'is-active': selectedUser === 0 })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUser === user.id })}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className={query.length !== 0 && 'delete'}
                    onClick={() => setQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectCaregories.length > 0,
                })}
              >
                All
              </a>
              {categoriesFromServer.map(caregr => (
                <a
                  key={caregr.id}
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectCaregories.includes(caregr.id),
                  })}
                  href="#/"
                  onClick={() => handleSelectedCategory(caregr.id)}
                >
                  {caregr.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleResetAll()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filtredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <Table
              filtredProducts={filtredProducts}
              SORT_BY={SORT_BY}
              setSortBy={setSortBy}
            />
          )}
        </div>
      </div>
    </div>
  );
};
