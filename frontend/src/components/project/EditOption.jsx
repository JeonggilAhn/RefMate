import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon';

export function EditOption({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:outline-none focus-visible:ring-0 p-0 hover:bg-[#F1F1F1] cursor-pointer rounded-full w-7 h-7 z-5"
      >
        <Button variant="none" onClick={toggleModal}>
          <Icon name="IconPiDotsThree" width={25} height={25} />
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent className="min-w-[5rem]" ref={modalRef}>
          <DropdownMenuGroup>
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  action.handler();
                  setIsOpen(false);
                }}
                className="flex justify-center"
              >
                {action.name}
                <DropdownMenuSeparator />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

export default EditOption;
