import { FC } from 'react'

import { RadioButtonField } from '@banx/components/RadioButton'
import { InputCounter, NumericInputField } from '@banx/components/inputs'

import { OfferActionButtons, OfferHeader, OfferSummary } from './components'
import { DEFAULTS_OPTIONS } from './constants'
import { usePlaceOfferTab } from './hooks'

import styles from './PlaceOfferTab.module.less'

interface PlaceOfferTab {
  marketPubkey: string
}

const PlaceOfferTab: FC<PlaceOfferTab> = ({ marketPubkey }) => {
  const {
    isEdit,
    goToPlaceOffer,
    bondFeature,
    onBondFeatureChange,
    loansAmount,
    onLoanAmountChange,
    loanValue,
    onLoanValueChange,
    onCreateOffer,
    onRemoveOffer,
  } = usePlaceOfferTab(marketPubkey)

  return (
    <div className={styles.content}>
      <OfferHeader isEdit={isEdit} goToPlaceOffer={goToPlaceOffer} />
      <RadioButtonField
        tooltipText="When funding full loans, lenders have the option to get defaulted NFTs instead of the SOL recovered from the liquidation"
        label="If full loan liquidated"
        currentOption={{
          label: bondFeature,
          value: bondFeature,
        }}
        onOptionChange={onBondFeatureChange}
        options={DEFAULTS_OPTIONS}
      />
      <div className={styles.fields}>
        <NumericInputField
          label="Offer"
          value={loanValue}
          onChange={onLoanValueChange}
          className={styles.numericField}
        />
        <InputCounter label="Number of loans" onChange={onLoanAmountChange} value={loansAmount} />
      </div>
      <OfferSummary />
      <OfferActionButtons
        isEdit={isEdit}
        onCreateOffer={onCreateOffer}
        onRemoveOffer={onRemoveOffer}
      />
    </div>
  )
}

export default PlaceOfferTab