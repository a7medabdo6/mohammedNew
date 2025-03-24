// import { useState } from 'react';
// import { sentenceCase } from 'change-case';
// // @mui
// import {
//   Link,
//   Stack,
//   Button,
//   TableRow,
//   Checkbox,
//   MenuItem,
//   TableCell,
//   IconButton,
// } from '@mui/material';
// // utils
// import { fDate } from '../../../../utils/formatTime';
// import { fCurrency } from '../../../../utils/formatNumber';
// // @types
// import { IProduct } from '../../../../@types/product';
// // components
// import Label from '../../../../components/label';
// import Image from '../../../../components/image';
// import Iconify from '../../../../components/iconify';
// import MenuPopover from '../../../../components/menu-popover';
// import ConfirmDialog from '../../../../components/confirm-dialog';

// // ----------------------------------------------------------------------

// type Props = {
//   row: IProduct;
//   selected: boolean;
//   onEditRow: VoidFunction;
//   onViewRow: VoidFunction;
//   onSelectRow: VoidFunction;
//   onDeleteRow: VoidFunction;
// };

// export default function ProductTableRow({
//   row,
//   selected,
//   onSelectRow,
//   onDeleteRow,
//   onEditRow,
//   onViewRow,
// }: Props) {
//   const { name, cover, createdAt, inventoryType, price } = row;

//   const [openConfirm, setOpenConfirm] = useState(false);

//   const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

//   const handleOpenConfirm = () => {
//     setOpenConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setOpenConfirm(false);
//   };

//   const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
//     setOpenPopover(event.currentTarget);
//   };

//   const handleClosePopover = () => {
//     setOpenPopover(null);
//   };

//   return (
//     <>
//       <TableRow hover selected={selected}>
//         <TableCell padding="checkbox">
//           <Checkbox checked={selected} onClick={onSelectRow} />
//         </TableCell>

//         <TableCell>
//           <Stack direction="row" alignItems="center" spacing={2}>
//             <Image
//               disabledEffect
//               visibleByDefault
//               alt={name}
//               src={cover}
//               sx={{ borderRadius: 1.5, width: 48, height: 48 }}
//             />

//             <Link
//               noWrap
//               color="inherit"
//               variant="subtitle2"
//               onClick={onViewRow}
//               sx={{ cursor: 'pointer' }}
//             >
//               {name}
//             </Link>
//           </Stack>
//         </TableCell>

//         <TableCell>{fDate(createdAt)}</TableCell>

//         <TableCell align="center">
//           <Label
//             variant="soft"
//             color={
//               (inventoryType === 'out_of_stock' && 'error') ||
//               (inventoryType === 'low_stock' && 'warning') ||
//               'success'
//             }
//             sx={{ textTransform: 'capitalize' }}
//           >
//             {inventoryType ? sentenceCase(inventoryType) : ''}
//           </Label>
//         </TableCell>
        

//         <TableCell align="right">{fCurrency(price)}</TableCell>

//         <TableCell align="right">
//           <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       <MenuPopover
//         open={openPopover}
//         onClose={handleClosePopover}
//         arrow="right-top"
//         sx={{ width: 140 }}
//       >
//         <MenuItem
//           onClick={() => {
//             handleOpenConfirm();
//             handleClosePopover();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <Iconify icon="eva:trash-2-outline" />
//           Delete
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             onEditRow();
//             handleClosePopover();
//           }}
//         >
//           <Iconify icon="eva:edit-fill" />
//           Edit
//         </MenuItem>
//       </MenuPopover>

//       <ConfirmDialog
//         open={openConfirm}
//         onClose={handleCloseConfirm}
//         title="Delete"
//         content="Are you sure want to delete?"
//         action={
//           <Button variant="contained" color="error" onClick={onDeleteRow}>
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }

import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Link,
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// @types
// import { IProduct } from '../../../../@types/product';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------
export interface IProduct {
  _id?: string; // جعل `_id` اختياريًا
  name: string;
  description?: { en?: string }; // تعديل `description` ليكون بنفس هيكلة البيانات القادمة
  images: string[]; // Array of image URLs
  price: number;
  priceBeforeOffer?: number; // Optional price before discount
  isOffer: boolean;
  quantity: number;
  rating: number;
  category:string;
  subcategory?: string;
  createdAt: Date;
  isTopSelling?: boolean;
  isTrending?: boolean;
  isTopRating?: boolean;
  inventoryType?: string;
  cover?: string;


}

type Props = {
  row: IProduct;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {

  const {
    name,
    cover,
    createdAt,
    inventoryType,
    price,
    quantity,
    rating,
    category,
    subcategory,
    isOffer,
    priceBeforeOffer,
    isTopSelling,
    isTrending,
    isTopRating,
  } = row;
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          

            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {name}
            </Link>
        </TableCell>
        <TableCell>
            <Image
              disabledEffect
              visibleByDefault
              alt={name}
              src={cover}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />

         
        </TableCell>

        <TableCell>{fDate(createdAt)}</TableCell>

        {/* حالة المخزون */}
        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (inventoryType === 'out_of_stock' && 'error') ||
              (inventoryType === 'low_stock' && 'warning') ||
              'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {inventoryType ? sentenceCase(inventoryType) : ''}
          </Label>
        </TableCell>

        <TableCell align="center">{category}</TableCell>
        <TableCell align="center">{subcategory}</TableCell>

        <TableCell align="center">{price}</TableCell>
        <TableCell align="center">{priceBeforeOffer}</TableCell>

        {/* الكمية */}
        <TableCell align="center">{quantity}</TableCell>
        <TableCell align="center">{rating} ⭐</TableCell>

        {/* السعر والعرض */}
        <TableCell align="right">
          {isOffer ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'gray' }}>
              {fCurrency(priceBeforeOffer ?? 0)}
              </span>
              <br />
              <span style={{ fontWeight: 'bold', color: 'red' }}>
                {fCurrency(price)}
              </span>
            </>
          ) : (
            fCurrency(price)
          )}
        </TableCell>


      

        {/* التريند، الأكثر مبيعًا، الأعلى تقييمًا */}
        <TableCell align="center">
          {isTrending && <Label color="info">Trending</Label>}
          {isTopSelling && <Label color="primary">Top Selling</Label>}
          {isTopRating && <Label color="success">Top Rated</Label>}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
        onClick={() => {
          try {
            onEditRow();
          } catch (error) {
          }
          handleClosePopover();
        }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

