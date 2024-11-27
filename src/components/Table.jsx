import React from 'react';

export default function Table(params) {
  const { filtredProducts, SORT_BY, setSortBy } = params;

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {Object.keys(SORT_BY).map(key => (
            <th key={key} onClick={() => setSortBy(SORT_BY[key])}>
              <span className="is-flex is-flex-wrap-nowrap">
                {SORT_BY[key]}
                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort" />
                  </span>
                </a>
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {filtredProducts.map(product => (
          <tr data-cy="Product" key={product.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">{product.name}</td>
            <td data-cy="ProductCategory">
              {product.category.icon} - {product.category.title}
            </td>

            <td
              data-cy="ProductUser"
              className={
                product.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
              }
            >
              {product.user.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
