import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Segmented, SegmentedValue } from '@/components/ui/segmented';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { Routes } from '@/routes';
import { MessageSquareText } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'umi';

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigateWithFromState();
  const { navigateToOldProfile } = useNavigatePage();

  const {
    data: { avatar, nickname },
  } = useFetchUserInfo();

  const tagsData = useMemo(
    () => [
      // { path: Routes.Root, name: t('header.Root'), icon: House },
      { path: Routes.Root, name: t('header.chat'), icon: MessageSquareText },
      // { path: Routes.Datasets, name: t('header.dataset'), icon: Library },
    ],
    [t],
  );

  const options = useMemo(() => {
    return tagsData.map((tag) => {
      const HeaderIcon = tag.icon;

      return {
        label:
          tag.path === Routes.Root ? (
            <HeaderIcon className="size-6"></HeaderIcon>
          ) : (
            <span>{tag.name}</span>
          ),
        value: tag.path,
      };
    });
  }, [tagsData]);

  const handleChange = (path: SegmentedValue) => {
    navigate(path as Routes);
  };

  return (
    <section className="py-5 px-10 flex justify-between items-center ">
      <Segmented
        rounded="xxxl"
        sizeType="xl"
        buttonSize="xl"
        options={options}
        value={Routes.Root}
        onChange={handleChange}
        activeClassName="text-bg-base bg-metallic-gradient border-b-[#00BEB4] border-b-2"
      ></Segmented>
      <div className="flex items-center gap-5 text-text-badge">
        <div className="relative">
          <RAGFlowAvatar
            name={nickname}
            avatar={avatar}
            isPerson
            className="size-8 cursor-pointer"
            onClick={navigateToOldProfile}
          ></RAGFlowAvatar>
        </div>
      </div>
    </section>
  );
}
