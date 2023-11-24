import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RadioButton from 'survey/radio-button.react-component';

import './captions-form.less';
import {CAPTION_TABS} from './constants';

export const FilterRadioButton = ({activeTab, name, text, setActiveTab, filteredCounts}) => {
    if (filteredCounts[name] === 0) {
        if (activeTab === name) {
            setActiveTab(CAPTION_TABS.ALL)();
        }
        return null;
    }

    const setActiveHandler = () => setActiveTab(name);

    return (
        <RadioButton
            name="captions-filter"
            checked={activeTab === name}
            onChange={setActiveHandler()}
        >
            {interpolate(
                text,
                {
                    count: filteredCounts[name],
                },
                true,
            )}
        </RadioButton>
    );
};

FilterRadioButton.propTypes = {
    activeTab: PropTypes.string.isRequired,
    name: PropTypes.oneOf(Object.keys(CAPTION_TABS)).isRequired,
    text: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    filteredCounts: PropTypes.object.isRequired,
};

@inject('store')
@observer
export default class FilterButtons extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    setTab(tab) {
        return () => this.props.store.setActiveTab(tab);
    }

    isAllManualCaptioned() {
        const filterCounts = Object.values(this.props.store.filteredCounts);
        return filterCounts.every((count) => count === 0);
    }

    render() {
        if (this.isAllManualCaptioned()) {
            this.props.store.setActiveTab(CAPTION_TABS.ALL);
            return null;
        }

        const {activeTab, filteredCounts} = this.props.store;
        const sharedRadioButtonProps = {
            activeTab,
            filteredCounts,
            setActiveTab: this.setTab,
        };

        return (
            <div styleName="filter-buttons" data-purpose="captions-filter">
                <RadioButton
                    name="captions-filter"
                    checked={activeTab === CAPTION_TABS.ALL}
                    onChange={this.setTab(CAPTION_TABS.ALL)}
                >
                    {gettext('All')}
                </RadioButton>

                <FilterRadioButton
                    name={CAPTION_TABS.UNCAPTIONED}
                    text={gettext('Uncaptioned (%(count)s)')}
                    {...sharedRadioButtonProps}
                />

                <FilterRadioButton
                    name={CAPTION_TABS.AUTOCAPTIONED}
                    text={gettext('Autogenerated (%(count)s)')}
                    {...sharedRadioButtonProps}
                />

                <FilterRadioButton
                    name={CAPTION_TABS.LOW_QUALITY}
                    text={gettext('Low Quality (%(count)s)')}
                    {...sharedRadioButtonProps}
                />
            </div>
        );
    }
}