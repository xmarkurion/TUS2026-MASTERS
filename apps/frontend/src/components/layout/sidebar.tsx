import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { Link } from 'react-router-dom';
import { mainMenu } from '@/config/menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {mainMenu.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {/* Parent item */}
                <SidebarMenuItem>
                  {group.items ? (
                    <SidebarMenuButton>
                      {group.icon && <group.icon />}
                      {group.title}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={group.url}>
                        {group.icon && <group.icon />}
                        {group.title}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>

                {/* Child items */}
                {group.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <Link to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">AgileMind</p>
            <p className="text-muted-foreground text-xs">AI Project Manager</p>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
