# shadcn/ui Setup Guide for Sightseeing Roma

## ✅ What's Been Installed

### Dependencies
- `class-variance-authority` - For component variants
- `clsx` - For conditional class names
- `tailwind-merge` - To merge Tailwind classes properly
- `lucide-react` - Icons library
- `@radix-ui/react-dialog` - Dialog/Sheet primitive
- `@radix-ui/react-slot` - For flexible component composition
- `tailwindcss-animate` - Animations for shadcn/ui

### File Structure Created
```
src/
├── lib/
│   └── utils.js                    # Utility functions (cn helper)
├── components/
│   ├── ui/
│   │   ├── button.jsx             # Button component
│   │   ├── sheet.jsx              # Sheet component
│   │   └── index.js               # Export barrel file
│   ├── SheetDemo.jsx              # Basic demo component
│   ├── MobileNavSheet.jsx         # Mobile navigation example
│   └── TicketDetailsSheet.jsx     # Ticket details example
```

## 🚀 How to Use the Sheet Component

### Basic Usage
```jsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function MyComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Sheet</SheetTitle>
        </SheetHeader>
        <p>Sheet content goes here</p>
      </SheetContent>
    </Sheet>
  );
}
```

### Available Sheet Components
- `Sheet` - Root component
- `SheetTrigger` - Button that opens the sheet
- `SheetContent` - The sheet content area
- `SheetHeader` - Header section
- `SheetTitle` - Title text
- `SheetDescription` - Description text
- `SheetFooter` - Footer section
- `SheetClose` - Component that closes the sheet

### Sheet Sides
You can position the sheet on different sides:
```jsx
<SheetContent side="left">   {/* left, right, top, bottom */}
  Content here
</SheetContent>
```

## 📱 Practical Examples Created

### 1. MobileNavSheet
A mobile navigation menu that slides from the left:
```jsx
import MobileNavSheet from "@/components/MobileNavSheet";

// Use in your navbar
<MobileNavSheet />
```

### 2. TicketDetailsSheet
A detailed view for ticket information:
```jsx
import TicketDetailsSheet from "@/components/TicketDetailsSheet";

// Wrap around any element to make it trigger the sheet
<TicketDetailsSheet ticket={ticketData}>
  <button>View Details</button>
</TicketDetailsSheet>
```

### 3. SheetDemo
Basic demonstration of all sheet features:
```jsx
import SheetDemo from "@/components/SheetDemo";

<SheetDemo />
```

## 🎨 Customization

### Custom Styling
All components accept `className` prop for custom styling:
```jsx
<SheetContent className="w-[600px] bg-gray-50">
  Custom styled content
</SheetContent>
```

### Brand Colors
The components are already configured to work with your existing brand colors:
- Primary red: `#930B31`
- Yellow accent: `#FAD502E0`

## 🛠 Configuration Files Updated

1. **tailwind.config.js** - Added shadcn/ui theme configuration
2. **index.css** - Added CSS variables and base styles
3. **vite.config.js** - Added path alias (@) for cleaner imports

## 📝 Usage in Your Project

You can now use Sheet components anywhere in your project:

1. **Mobile Navigation** - Replace burger menus with slide-out sheets
2. **Ticket Details** - Show detailed ticket info without page navigation
3. **Filters** - Create slide-out filter panels
4. **User Profiles** - Quick profile editing sheets
5. **Forms** - Modal-like forms that slide from the side

## 🚀 Next Steps

1. Test the components in your browser at http://localhost:5174/
2. Import and use the components in your existing pages
3. Customize the styling to match your exact design needs
4. Add more shadcn/ui components as needed (forms, cards, etc.)

## Example Integration

To add a sheet to your existing TicketCard component:
```jsx
import TicketDetailsSheet from "@/components/TicketDetailsSheet";

// In your TicketCard component
<TicketDetailsSheet ticket={ticketData}>
  <div className="cursor-pointer">
    {/* Your existing ticket card content */}
  </div>
</TicketDetailsSheet>
```
