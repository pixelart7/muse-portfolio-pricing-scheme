const pricingScheme = {
  products: {
    pdf_portfolio: {
      base: 350
    },
    print_portfolio: {
      base: 200,
      additional(portfolioInfo) {
        if (portfolioInfo.pages > 10 && portfolioInfo.pages <= 20) return 150
        if (portfolioInfo.pages > 20 && portfolioInfo.pages <= 40) return 450
        return 0
      },
      options: {
        binding: {
          none: 0,
          folder: 0,
          spine: 0,
          book: 100
        }
      }
    }
  },
  promoCode: {
    // 'PDFZEROBAHT': {
    //   pdf_portfolio: (val) => val - 350,
    //   print_portfolio: (val) => val
    // },
  }
}

module.exports = {
  pricingScheme,
  calculate (userCart, portfolioInfo) {
    const res = []
    const promo = userCart.promo
    userCart.items.forEach((elm, i) => {
      let price = 0
      if (Object.prototype.hasOwnProperty.call(this.pricingScheme.products, elm.slug)) {
        price += this.pricingScheme.products[elm.slug].base
        if (Object.prototype.hasOwnProperty.call(this.pricingScheme.products[elm.slug], 'additional')) {
          const addition = this.pricingScheme.products[elm.slug].additional(portfolioInfo)
          price += addition
        }
        if (Object.keys(elm.options).length > 0) {
          Object.keys(elm.options).forEach((option) => {
            if (Object.prototype.hasOwnProperty.call(this.pricingScheme.products[elm.slug], 'options')
              && Object.prototype.hasOwnProperty.call(this.pricingScheme.products[elm.slug].options, option)
            ) {
              price += this.pricingScheme.products[elm.slug].options[option][elm.options[option].slug]
            } // enter only valid option key
          })
        }
      } else {
        console.error('invalid slug')
        // invalid slug
      }

      if (promo !== '') {
        if (Object.prototype.hasOwnProperty.call(this.pricingScheme.promoCode, promo)) {
          if (Object.prototype.hasOwnProperty.call(this.pricingScheme.promoCode[promo], elm.slug)) {
            price = this.pricingScheme.promoCode[promo][elm.slug](price)
          }
        }
      }

      if (price < 0) price = 0

      res[i] = {unit: 0, quantity: 0, total: 0}
      res[i].unit = price
      res[i].quantity = elm.quantity
      res[i].total = elm.quantity * price

    })
    return res
  }
}