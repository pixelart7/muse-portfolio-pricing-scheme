> An internal module for a web service called "Muse Portfolio"

# calculate(userCart, portfolioInfo)

Use this module to calculate the final price for the portfolio

## userCart

```
{
  items: [
    {
      slug: 'pdf_portfolio',
      quantity: 1,
      options: {}
    }, // this slug is REQUIRED
    {
      slug: 'print_portfolio',
      quantity: 1,
      options: {
        binding: {
          slug: 'none',
          text: 'ไม่เข้าเล่ม',
          photoPath: 'https://via.placeholder.com/350x350',
          price: 0
        }
      }
    } // this slug is required at least one, but the quantity may be 0
    ...
  ],
  promo: '' // promo code to be checked with the DB
}
```

Eg.
```
{
  items: [
    {
      slug: 'pdf_portfolio',
      quantity: 1,
      options: {}
    },
    {
      slug: 'print_portfolio',
      quantity: 1,
      options: {
        binding: {
          slug: 'none',
          text: 'ไม่เข้าเล่ม',
          photoPath: 'https://via.placeholder.com/350x350',
          price: 0
        }
      }
    }
  ],
  promo: ''
}
```

## portfolioInfo

Currently, only one key "page" it is used for the calculation, back-end can just fetch the numbers of page from the internal generation function

```
{
  page: 10
}
```