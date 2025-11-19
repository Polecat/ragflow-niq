import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSetModalState } from '@/hooks/common-hooks';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import {
  useFetchConversation,
  useFetchDialog,
  useFetchDialogList,
  useGetChatSearchParams,
} from '@/hooks/use-chat-request';
import { cn } from '@/lib/utils';
import { isEmpty } from 'lodash';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'umi';
import { useHandleClickConversationCard } from '../hooks/use-click-card';
import { useRenameChat } from '../hooks/use-rename-chat';
import { ChatSettings } from './app-settings/chat-settings';
import { MultipleChatBox } from './chat-box/multiple-chat-box';
import { SingleChatBox } from './chat-box/single-chat-box';
import { Sessions } from './sessions';
import { useAddChatBox } from './use-add-box';
import { useSwitchDebugMode } from './use-switch-debug-mode';

export default function Chat() {
  const { id } = useParams();
  const { navigateToChat } = useNavigatePage();
  const { data } = useFetchDialog();
  const { t } = useTranslation();
  const { data: conversation } = useFetchConversation();
  const { data: dialogListData, loading: isDialogListLoading } =
    useFetchDialogList();
  const { handleConversationCardClick, controller, stopOutputMessage } =
    useHandleClickConversationCard();
  const { visible: settingVisible, switchVisible: switchSettingVisible } =
    useSetModalState(false);
  const {
    removeChatBox,
    addChatBox,
    chatBoxIds,
    hasSingleChatBox,
    hasThreeChatBox,
  } = useAddChatBox();
  const { onChatRenameOk } = useRenameChat();

  const { conversationId, isNew } = useGetChatSearchParams();

  const { isDebugMode, switchDebugMode } = useSwitchDebugMode();

  useEffect(() => {
    if (isDialogListLoading) return;
    // Only when we are on the root-mounted chat (no :id in URL)
    if (!id && dialogListData?.dialogs?.length) {
      const firstDialogId = dialogListData.dialogs[0].id;
      navigateToChat(firstDialogId)(); // navigate(`/next-chat/${firstDialogId}`)
    } else if (!id && dialogListData?.dialogs?.length === 0) {
      // when dialogs list is loaded and empty, auto-create one
      onChatRenameOk('Demo');
    }
  }, [id, isDialogListLoading, dialogListData, navigateToChat]);

  if (isDebugMode) {
    return (
      <section className="pt-14 h-[100vh] pb-24">
        <div className="flex items-center justify-between px-10 pb-5">
          <span className="text-2xl">
            {t('chat.multipleModels')} ({chatBoxIds.length}/3)
          </span>
          <Button variant={'ghost'} onClick={switchDebugMode}>
            {t('chat.exit')} <LogOut />
          </Button>
        </div>
        <MultipleChatBox
          chatBoxIds={chatBoxIds}
          controller={controller}
          removeChatBox={removeChatBox}
          addChatBox={addChatBox}
          stopOutputMessage={stopOutputMessage}
        ></MultipleChatBox>
      </section>
    );
  }

  return (
    <section className="h-full flex flex-col flex-1 min-h-0 pr-5">
      <div className="flex flex-1 min-h-0 pb-9">
        <Sessions
          hasSingleChatBox={hasSingleChatBox}
          handleConversationCardClick={handleConversationCardClick}
          switchSettingVisible={switchSettingVisible}
        ></Sessions>

        <Card className="flex-1 min-w-0 bg-transparent border h-full">
          <CardContent className="flex p-0 h-full">
            <Card className="flex flex-col flex-1 bg-transparent min-w-0">
              <CardHeader
                className={cn('p-5', { 'border-b': hasSingleChatBox })}
              >
                <CardTitle className="flex justify-between items-center text-base">
                  <div className="truncate">{conversation.name}</div>
                  <Button
                    variant={'ghost'}
                    onClick={switchDebugMode}
                    disabled={
                      hasThreeChatBox ||
                      isEmpty(conversationId) ||
                      isNew === 'true'
                    }
                  >
                    <ArrowUpRight /> {t('chat.multipleModels')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 min-h-0">
                <SingleChatBox
                  controller={controller}
                  stopOutputMessage={stopOutputMessage}
                ></SingleChatBox>
              </CardContent>
            </Card>
            {settingVisible && (
              <ChatSettings
                switchSettingVisible={switchSettingVisible}
              ></ChatSettings>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
