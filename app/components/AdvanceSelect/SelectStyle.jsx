
export const _customStyles = {

    control: (base, state) => ({
        ...base, minHeight: "50px", zIndex: 98,
        boxShadow: state.isFocused ? `0 0 0 0.2rem rgb(46 184 92 / 25%) !important` : 'none', borderRadius: '.25rem', fontSize: '14px',
        border: state.isFocused ? "1px solid #51ab1d" : "1px solid #e4e9f3",
        ':hover': {
            border: '1px solid #51ab1d',
            boxShadow: `0 0 0 0.2rem rgb(46 184 92 / 25%) !important`
        }
    }),
    option: (option, state) => ({ ...option, backgroundColor: state.isSelected ? '#51ab1d !important' : 'transparent', ":hover": { backgroundColor: '#51ab1d3b' } }),
    valueContainer: (valueContainer) => ({ ...valueContainer, flexWrap: 'nowrap', overflowX: 'auto', color: '#6e6e6e' }),
    multiValue: (multiValue) => ({ ...multiValue, flex: '1 0 auto', color: '#6e6e6e' }),
    singleValue: (value) => ({ ...value, color: '#6e6e6e' }),
    multiValueLabel: (valueLabel) => ({ ...valueLabel, color: '#6e6e6e' }),
    input: (input) => ({ ...input, border: '0 !important', boxShadow: "none !important", outline: "#000" }),
    menu: (menu) => ({ ...menu, backgroundColor: "#fff", zIndex: 99 })
}
