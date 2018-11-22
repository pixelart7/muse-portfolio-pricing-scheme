const expect = require('chai').expect
const PricingSchemeModule = require('../index.js')
const clone = require('clone')

const pricingSchemeBase = {
  products: {
    pdf_portfolio: {
      base: 350
    },
    print_portfolio: {
      base: 250,
      additional(portfolioInfo) {
        if (portfolioInfo.pages > 10)
          return (portfolioInfo.pages - 10) * 10 // plus 10 every page after 10th 
        return 0
      },
      options: {
        binding: {
          none: 0,
          folder: 100,
          spine: 250
        }
      }
    }
  },
  promoCode: {
    'PDFZEROBAHT': {
      pdf_portfolio: (val) => val - 350,
      print_portfolio: (val) => val
    },
    '50OFFPDF': {
      pdf_portfolio: (val) => Math.ceil(val / 2),
      print_portfolio: (val) => val
    },
    'DISCOUNTTOOMUCH': {
      pdf_portfolio: (val) => val - 400,
      print_portfolio: (val) => val
    }
  }
}

const userCartBase = {
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

describe('Pricing Scheme Calculation', function () {

  beforeEach(function () {
    pricingModule = {
      pricingScheme: clone(pricingSchemeBase),
      calculate: PricingSchemeModule.calculate
    }
    userCart = clone(userCartBase)
  });

  describe('PDFx1, Printx1 (base)', function () {
    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(350)
      expect(res[1].unit).to.equal(250)
    })

    it('should calculate total price successfully', function () {
      userCart.items[1].quantity = 3
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[1].unit).to.equal(250)
      expect(res[1].quantity).to.equal(3)
      expect(res[1].total).to.equal(750)
    })

    it('should be able to calculate minus promo code', function () {
      userCart.promo = 'PDFZEROBAHT'
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(0)
    })

    it('should be able to calculate percent promo code', function () {
      userCart.promo = '50OFFPDF'
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(175)
    })

    it('should return 0 if result after promo code is negative', function () {
      userCart.promo = 'DISCOUNTTOOMUCH'
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(0)
    })
  })

  describe('PDFx1, Printx2 (base)', function () {
    beforeEach(function () {
      userCart.items[1].quantity = 2
    });

    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[1].unit).to.equal(250)
    })
  })

  describe('PDFx1, Printx2 w/ Spine', function () {
    beforeEach(function () {
      userCart.items[1].quantity = 2
      userCart.items[1].options.binding.slug = 'spine'
    });

    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[1].unit).to.equal(500)
    })
  })

  describe('PDFx1, Printx1 w/ Spine, Printx2 w/ Folder', function () {
    beforeEach(function () {
      userCart.items[1].quantity = 1
      userCart.items[1].options.binding.slug = 'spine'
      userCart.items[2] = clone(userCart.items[1])
      userCart.items[2].quantity = 2
      userCart.items[2].options.binding.slug = 'folder'
    });

    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(350)
      expect(res[1].unit).to.equal(500)
      expect(res[1].total).to.equal(500)
      expect(res[2].unit).to.equal(350)
      expect(res[2].total).to.equal(700)
    })

    it('should return a correct calculation even with a promo code', function () {
      userCart.promo = '50OFFPDF'
      const res = pricingModule.calculate(userCart, { pages: 10 })
      expect(res[0].unit).to.equal(175)
      expect(res[1].unit).to.equal(500)
      expect(res[1].total).to.equal(500)
      expect(res[2].unit).to.equal(350)
      expect(res[2].total).to.equal(700)
    })
  })

  describe('PDFx1, Printx1 20 pages w/ Folder, Printx1 20 pages w/o options', function () {
    beforeEach(function () {
      userCart.items[1].quantity = 1
      userCart.items[1].options.binding.slug = 'folder'
      userCart.items[2] = clone(userCart.items[1])
      userCart.items[2].quantity = 1
      userCart.items[2].options.binding.slug = 'none'
    });

    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 20 })
      expect(res[1].unit).to.equal(450)
      expect(res[2].unit).to.equal(350)
    })

  })

  describe('PDFx1, Printx1 12 pages w/ Spine, Printx1 12 pages w/o options', function () {
    beforeEach(function () {
      userCart.items[1].quantity = 1
      userCart.items[1].options.binding.slug = 'spine'
      userCart.items[2] = clone(userCart.items[1])
      userCart.items[2].quantity = 1
      userCart.items[2].options.binding.slug = 'none'
    });

    it('should return a correct calculation', function () {
      const res = pricingModule.calculate(userCart, { pages: 12 })
      expect(res[1].unit).to.equal(520)
      expect(res[2].unit).to.equal(270)
    })

  })
  
})