import React from 'react';
import ReactDOM from 'react-dom';
import {
  Caption,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TrHeaderForDrawers,
  TrWithDrawer,
  TrWithoutDrawer
} from '../../../src/react/table';

describe('Table', () => {
  it('renders a table', () => {
    ReactDOM.render(<Table/>, root);
    expect('table').toExist();
    expect('table').toHaveClass('pui-table');
  });

  it('passes through classnames', () => {
    ReactDOM.render(<Table className="my-table"/>, root);
    expect('table').toHaveClass('my-table');
  });
});

describe('Caption', () => {
  it('renders a caption', () => {
    ReactDOM.render(<Table><Caption>My cool table</Caption></Table>, root);
    expect('caption').toHaveText('My cool table');
  });

  it('passes through classnames', () => {
    ReactDOM.render(<Table><Caption className="my-caption">My cool table</Caption></Table>, root);
    expect('caption').toHaveClass('my-caption');
  });
});

describe('Th', () => {
  it('defaults the scope to col', () => {
    ReactDOM.render(<Table><Thead><Tr><Th>My awesome header</Th></Tr></Thead></Table>, root);
    expect('table thead tr th').toHaveAttr('scope', 'col');
  });
});

describe('TrHeaderForDrawers', () => {
  beforeEach(() => {
    ReactDOM.render(<Table><Thead><TrHeaderForDrawers>
      <Th>Content header 1</Th>
      <Th>Content header 2</Th>
    </TrHeaderForDrawers></Thead></Table>, root);
  });

  it(
    'renders an empty table header that sets the column' +
    'to the proper width for collapsible toggles',
    () => {
      expect(document.querySelectorAll('th')[0]).toHaveText('');
      expect(document.querySelectorAll('th')[0]).toHaveClass('pui-table--collapsible-toggle');
    }
  );

  it('renders table header cells given as children after the toggle header cell', () => {
    const ths = document.querySelectorAll('th');
    expect(ths).toHaveLength(3);
    expect(ths[1]).toHaveText('Content header 1');
    expect(ths[2]).toHaveText('Content header 2');
  });
});

describe('TrWithoutDrawer', () => {
  beforeEach(() => {
    ReactDOM.render(<Table>
      <Tbody>
        <TrWithoutDrawer>
          <Td>Content cell 1</Td>
          <Td>Content cell 2</Td>
        </TrWithoutDrawer>
      </Tbody>
    </Table>, root);
  });

  it('renders an empty table data that sets the column to the proper width for collapsible toggles', () => {
      expect(document.querySelectorAll('td')[0]).toHaveText('');
      expect(document.querySelectorAll('td')[0]).toHaveClass('pui-table--collapsible-toggle');
    }
  );

  it('renders table data cells given as children after the table data spacer cell', () => {
    const tds = document.querySelectorAll('td');
    expect(tds).toHaveLength(3);
    expect(tds[1]).toHaveText('Content cell 1');
    expect(tds[2]).toHaveText('Content cell 2');
  });
});

describe('TrWithDrawer', () => {
  let ariaLabelCollapsed, ariaLabelExpanded, drawerContent, onExpandSpy, className;

  beforeEach(() => {
    onExpandSpy = jest.fn();
    ariaLabelCollapsed = 'show the thing';
    ariaLabelExpanded = 'hide the thing';
    className = 'my-special-class';
    drawerContent = <i>Drawer content</i>;

    ReactDOM.render(<Table><Tbody>
      <TrWithDrawer {...{ariaLabelCollapsed, ariaLabelExpanded, drawerContent, className, onExpand: onExpandSpy}}>
        <Td>Content cell 1</Td>
        <Td>Content cell 2</Td>
      </TrWithDrawer>
    </Tbody></Table>, root);
  });

  it('passes the className to the hidden drawer row', () => {
    const drawerTr = document.querySelectorAll('tr')[1];
    expect(drawerTr).toHaveClass(className);
  });

  it('renders a collapsible toggle for a row drawer in collapsed state', () => {
    const toggleTd = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
    expect(toggleTd).not.toHaveClass('active-indicator');
    expect(toggleTd.querySelector('button')).toHaveClass('pui-table--collapsible-btn');
    expect(toggleTd.querySelector('button')).toHaveAttr('aria-label', 'show the thing');
    expect(toggleTd.querySelector('button div')).toHaveClass('transition-transform');
    expect(toggleTd.querySelector('button div')).not.toHaveClass('rotate-qtr-turn');
    expect(toggleTd.querySelector('button div svg')).toHaveClass('icon-chevron_right');
  });

  it('renders table data cells given as children after the toggle cell', () => {
    const tds = document.querySelectorAll('tr')[0].querySelectorAll('td');
    expect(tds).toHaveLength(3);
    expect(tds[1]).toHaveText('Content cell 1');
    expect(tds[2]).toHaveText('Content cell 2');
  });

  it('renders hidden drawer row with drawer content in a single full-width cell', () => {
    const drawerTr = document.querySelectorAll('tr')[1];
    const drawerTds = drawerTr.querySelectorAll('td');
    expect(drawerTr).toHaveClass('border-top-0');
    expect(drawerTds).toHaveLength(1);
    expect(drawerTds[0]).toHaveAttr('colspan', '3');
    expect(drawerTds[0].querySelector('.pui-collapsible')).not.toHaveClass('in');
    expect(drawerTds[0].querySelector('.pui-collapsible')).toHaveAttr('aria-hidden', 'true');
    expect(drawerTds[0].querySelector('.pui-collapsible i')).toHaveText('Drawer content');
  });

  describe('when clicked to expand', () => {
    beforeEach(() => {
      document.querySelector('td button').click();
    });

    it('renders collapsible toggle as expanded', () => {
      const toggleTd = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
      expect(toggleTd).toHaveClass('active-indicator');
      expect(toggleTd.querySelector('.pui-table--collapsible-btn')).toHaveAttr('aria-label', 'hide the thing');
      expect(toggleTd.querySelector('.pui-table--collapsible-btn div')).toHaveClass('rotate-qtr-turn');
    });

    it('displays the drawer content', () => {
      const drawerTr = document.querySelectorAll('tr')[1];
      const drawer = drawerTr.querySelector('.pui-collapsible');
      expect(drawerTr).not.toHaveClass('border-top-0');
      expect(drawerTr).not.toHaveClass('display-none');
      expect(drawer).toHaveClass('in');
      expect(drawer.getAttribute('aria-hidden')).toBe('false');
    });

    it('calls the onExpand callback', () => {
      expect(onExpandSpy).toHaveBeenCalled();
    });

    describe('when clicked to collapse', () => {
      beforeEach(() => {
        onExpandSpy.mockClear();
        document.querySelector('td button').click();
      });

      it('renders collapsible toggle as collapsed', () => {
        const toggleTd = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
        expect(toggleTd).not.toHaveClass('active-indicator');
        expect(toggleTd.querySelector('.pui-table--collapsible-btn')).toHaveAttr('aria-label', 'show the thing');
        expect(toggleTd.querySelector('.pui-table--collapsible-btn div')).not.toHaveClass('rotate-qtr-turn');
      });

      it('hides the drawer content', () => {
        const drawerTr = document.querySelectorAll('tr')[1];
        const drawer = document.querySelectorAll('tr')[1].querySelector('.pui-collapsible');
        expect(drawer).not.toHaveClass('in');
        expect(drawer).toHaveAttr('aria-hidden');
        expect(drawerTr).toHaveClass('border-top-0');
        expect(drawerTr).toHaveClass('display-none');
      });

      it('does not call the onExpand callback', () => {
        expect(onExpandSpy).not.toHaveBeenCalled();
      });
    });
  });
});