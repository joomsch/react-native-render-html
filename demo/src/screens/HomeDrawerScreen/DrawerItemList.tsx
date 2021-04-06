import React from 'react';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import TideAtom from '../../components/atoms/TideAtom';
import { Stack } from '@mobily/stacks';
import BoxNucleon from '../../components/nucleons/BoxNucleon';
import { IconNucleonProps } from '../../components/nucleons/IconNucleon';
import TextNucleon from '../../components/nucleons/TextNucleon';
import { useColorRoles } from '../../theme/colorSystem';

function groupBy<T, K extends keyof T>(xs: Array<T>, key: K) {
  return xs.reduce(function (rv, x) {
    //@ts-ignore
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {} as T[K] extends string ? Record<T[K], Array<T>> : never);
}

interface ItemDefinition {
  index: number;
  group: string;
  groupLabel: string;
  key: string;
  name: string;
  title: string;
  drawerLabel: string;
  iconName: IconNucleonProps['name'];
}

/**
 * Component that renders the navigation list in the drawer.
 */
export default function DrawerItemList({
  state,
  navigation,
  descriptors
}: DrawerContentComponentProps<any>) {
  const { surface } = useColorRoles();
  //  const buildLink = useLinkBuilder();
  // const routes = state.routes as Array<{ key: string; }>
  const routeDefinitions = state.routes.map(
    ({ key, name }: { key: string; name: string }, index: number) => ({
      ...descriptors[key].options,
      key,
      name,
      index
    })
  ) as Array<ItemDefinition>;
  const renderItem = ({
    key,
    title,
    drawerLabel,
    iconName,
    name,
    index
  }: ItemDefinition) => {
    const focused = index === state.index;
    return (
      <TideAtom
        key={key}
        title={
          drawerLabel !== undefined
            ? drawerLabel
            : title !== undefined
            ? title
            : name
        }
        leftIconName={iconName}
        active={focused}
        // to={buildLink(route.name, route.params)}
        onPress={() => {
          navigation.dispatch({
            ...(focused
              ? DrawerActions.closeDrawer()
              : CommonActions.navigate(name)),
            target: state.key
          });
        }}
      />
    );
  };
  const renderGroup = (name: string, defs: ItemDefinition[]) => {
    return (
      <BoxNucleon key={name}>
        <Stack space={1}>
          <TextNucleon
            color={surface.secondaryContent}
            fontSize="small"
            style={{ textTransform: 'uppercase' }}>
            {name}
          </TextNucleon>
          {defs.map(renderItem)}
        </Stack>
      </BoxNucleon>
    );
  };
  const groups = groupBy(routeDefinitions, 'group');
  return (
    <BoxNucleon paddingY={1} paddingX={1}>
      <Stack space={4}>
        {Object.entries(groups).map(([name, defs]) => renderGroup(name, defs))}
      </Stack>
    </BoxNucleon>
  );
}
