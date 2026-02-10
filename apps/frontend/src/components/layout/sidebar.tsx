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

import { mainMenu } from '@/config/menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
                  <SidebarMenuButton>
                    {group.icon && <group.icon />}
                    {group.title}
                  </SidebarMenuButton>
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
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>GK</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Grok</p>
            <p className="text-muted-foreground text-xs">AI Project Manager</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
