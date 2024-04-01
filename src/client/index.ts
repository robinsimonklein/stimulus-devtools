import { Observer } from '@/client/Observer.ts';
import { Inspector } from '@/client/Inspector.ts';
import { MessageType } from '@/enum';

const observer = new Observer();
const inspector = new Inspector();

window.addEventListener('message', e => {
  const message = e.data;
  if (!message) return;

  if (message.type !== MessageType.Action) return;
  if (!observer) return;

  const actionName = message.name as string;

  // @ts-ignore
  if (observer[actionName] && typeof observer[actionName] === 'function') observer[actionName](message.args);
  // @ts-ignore
  if (inspector[actionName] && typeof inspector[actionName] === 'function') inspector[actionName](message.args);
});
